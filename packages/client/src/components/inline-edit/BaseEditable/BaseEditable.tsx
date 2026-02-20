/**
 * BaseEditable Component
 *
 * Foundation component that manages the state machine, interactions,
 * and composition pattern for all inline editable components.
 *
 * @module inline-edit/BaseEditable
 */
import * as React from 'react';
import { useCallback, useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ZodSchema } from 'zod';
import type {
  EditableState,
  RenderEditModeProps,
  BaseEditableProps,
} from '../types';

/**
 * Validates a value using either a Zod schema or a custom validation function.
 */
function validateValue<T>(
  value: T,
  validate?: ZodSchema<T> | ((value: T) => string | null)
): string | null {
  if (!validate) return null;

  if (typeof validate === 'function') {
    return validate(value);
  }

  // Zod schema
  const result = validate.safeParse(value);
  if (!result.success) {
    return result.error.errors[0]?.message ?? 'Validation failed';
  }
  return null;
}

/**
 * BaseEditable - Foundation component for inline editing
 *
 * Manages state machine transitions:
 * - rest: Default display state
 * - interest: Hover/focus state with visual feedback
 * - edit: Active editing with custom edit UI
 * - saving: Async save in progress
 *
 * Design specs from Figma (node 1252-9022):
 * - Label: 12px, gray-950, tracking-[0.18px], leading-4
 * - Content: 14px, foreground, tracking-[0.07px], leading-[21px]
 * - Gap: 4px (gap-1)
 * - Content padding: 4px/2px (px-1 py-0.5)
 * - Content border-radius: 4px (rounded)
 * - Hover: bg-gray-200 (#dfe2e2)
 */
export function BaseEditable<T>({
  label,
  value,
  displayValue,
  className,
  readonly = false,
  isEditing: controlledIsEditing,
  onEditingChange,
  renderEditMode,
  onSave,
  validate,
  exitOnBlur = true,
  formatValue,
  showSavingState = true,
}: BaseEditableProps<T>) {
  // State management
  const [internalState, setInternalState] = useState<EditableState>('rest');
  const [pendingValue, setPendingValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);

  // Determine if editing is controlled or internal
  const isControlled = controlledIsEditing !== undefined;
  const isEditing = isControlled ? controlledIsEditing : internalState === 'edit';
  const isSaving = internalState === 'saving';

  // Derive the current state
  const state: EditableState = isSaving
    ? 'saving'
    : isEditing
      ? 'edit'
      : internalState;

  /**
   * Transitions to edit state
   */
  const enterEditMode = useCallback(() => {
    if (readonly) return;

    if (isControlled) {
      onEditingChange?.(true);
    } else {
      setInternalState('edit');
    }
    setPendingValue(value);
    setError(null);
  }, [readonly, isControlled, onEditingChange, value]);

  /**
   * Transitions out of edit state (cancel)
   */
  const exitEditMode = useCallback(() => {
    if (isControlled) {
      onEditingChange?.(false);
    } else {
      setInternalState('rest');
    }
    setPendingValue(null);
    setError(null);
  }, [isControlled, onEditingChange]);

  /**
   * Handles save action with validation
   */
  const handleSave = useCallback(
    async (newValue: T) => {
      // Validate before saving
      const validationError = validateValue(newValue, validate);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Transition to saving state (if enabled)
      if (showSavingState) {
        setInternalState('saving');
        setPendingValue(newValue);
      }

      try {
        await onSave(newValue);
        // Success - exit edit mode
        if (isControlled) {
          onEditingChange?.(false);
        }
        setInternalState('rest');
        setPendingValue(null);
        setError(null);
      } catch (err) {
        // Error - return to edit mode with error
        const errorMessage =
          err instanceof Error ? err.message : 'Save failed';
        setError(errorMessage);
        if (isControlled) {
          onEditingChange?.(true);
        } else {
          setInternalState('edit');
        }
      }
    },
    [validate, onSave, isControlled, onEditingChange, showSavingState]
  );

  /**
   * Handles cancel action
   */
  const handleCancel = useCallback(() => {
    exitEditMode();
  }, [exitEditMode]);

  /**
   * Clears the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Mouse event handlers for interest state
  const handleMouseEnter = useCallback(() => {
    if (!readonly && state === 'rest') {
      setInternalState('interest');
    }
  }, [readonly, state]);

  const handleMouseLeave = useCallback(() => {
    if (state === 'interest') {
      setInternalState('rest');
    }
  }, [state]);

  // Focus event handlers
  const handleFocus = useCallback(() => {
    if (!readonly && state === 'rest') {
      setInternalState('interest');
    }
  }, [readonly, state]);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      // Check if focus is moving outside the container
      if (
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget as Node)
      ) {
        if (state === 'interest') {
          setInternalState('rest');
        } else if (state === 'edit' && exitOnBlur) {
          // Cancel edit when focus leaves container (unless exitOnBlur is false)
          exitEditMode();
        }
      }
    },
    [state, exitEditMode, exitOnBlur]
  );

  // Keyboard event handlers
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (state === 'interest' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        enterEditMode();
      } else if (state === 'edit' && e.key === 'Escape') {
        e.preventDefault();
        exitEditMode();
      }
    },
    [state, enterEditMode, exitEditMode]
  );

  // Click handler for entering edit mode
  const handleClick = useCallback(() => {
    if (!readonly && (state === 'rest' || state === 'interest')) {
      enterEditMode();
    }
  }, [readonly, state, enterEditMode]);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Render props for edit mode
  const editModeProps: RenderEditModeProps<T> = {
    value: pendingValue ?? value,
    onSave: handleSave,
    onCancel: handleCancel,
    inputRef: inputRef as React.RefObject<HTMLElement>,
    error,
    clearError,
  };

  // Style classes based on Figma design specs
  const containerClasses = cn(
    'flex flex-col', // No gap between label and content per Figma
    'w-full', // Fill container - parent controls width
    className
  );

  const labelClasses = cn(
    'text-xs', // 12px
    'text-gray-950', // #192627
    'tracking-[0.18px]',
    'leading-4', // 16px
    'px-1' // 4px horizontal padding to align with content
  );

  const contentClasses = cn(
    'text-sm', // 14px
    'font-medium', // Inter Medium (500)
    'text-foreground', // #020617
    'tracking-[0.07px]',
    'leading-[21px]',
    'px-1 py-2', // 4px horizontal, 8px vertical padding
    'rounded', // 4px border-radius
    'transition-colors duration-150',
    'cursor-pointer',
    !readonly && 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    state === 'interest' && 'bg-gray-200', // Only background changes on hover
    readonly && 'cursor-default'
  );

  const editContainerClasses = cn(
    'flex flex-col gap-1'
  );

  const errorClasses = cn(
    'text-xs text-destructive mt-1'
  );

  const savingClasses = cn(
    contentClasses,
    'flex items-center gap-2',
    'cursor-wait'
  );

  // Render content based on state
  const renderContent = () => {
    // Edit state
    if (state === 'edit') {
      return (
        <div className={editContainerClasses}>
          {renderEditMode(editModeProps)}
          {error && (
            <span className={errorClasses} role="alert">
              {error}
            </span>
          )}
        </div>
      );
    }

    // Saving state
    if (state === 'saving') {
      // Always use formatValue on pendingValue (default to String if no formatter provided)
      const formatter = formatValue ?? ((v: T) => String(v));
      const savingDisplay = formatter(pendingValue as T);
      
      return (
        <div className={savingClasses}>
          <span>{savingDisplay}</span>
          <Loader2 className="h-3 w-3 animate-spin" aria-label="Saving..." />
        </div>
      );
    }

    // Rest/Interest state
    return (
      <div
        ref={contentRef}
        className={contentClasses}
        tabIndex={readonly ? -1 : 0}
        role="button"
        aria-label={`Edit ${label}`}
        aria-readonly={readonly}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {displayValue ?? String(value)}
      </div>
    );
  };

  return (
    <div ref={containerRef} className={containerClasses} onBlur={handleBlur}>
      <span className={labelClasses}>{label}</span>
      {renderContent()}
    </div>
  );
}

export default BaseEditable;
