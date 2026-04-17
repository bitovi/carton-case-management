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
  const [internalState, setInternalState] = useState<EditableState>('rest');
  const [pendingValue, setPendingValue] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLElement>(null);

  const isControlled = controlledIsEditing !== undefined;
  const isEditing = isControlled ? controlledIsEditing : internalState === 'edit';
  const isSaving = internalState === 'saving';

  const state: EditableState = isSaving
    ? 'saving'
    : isEditing
      ? 'edit'
      : internalState;

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

  const exitEditMode = useCallback(() => {
    if (isControlled) {
      onEditingChange?.(false);
    } else {
      setInternalState('rest');
    }
    setPendingValue(null);
    setError(null);
  }, [isControlled, onEditingChange]);

  const handleSave = useCallback(
    async (newValue: T) => {
      const validationError = validateValue(newValue, validate);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (showSavingState) {
        setInternalState('saving');
        setPendingValue(newValue);
      }

      try {
        await onSave(newValue);
        if (isControlled) {
          onEditingChange?.(false);
        }
        setInternalState('rest');
        setPendingValue(null);
        setError(null);
      } catch (err) {
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

  const handleCancel = useCallback(() => {
    exitEditMode();
  }, [exitEditMode]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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

  const handleFocus = useCallback(() => {
    if (!readonly && state === 'rest') {
      setInternalState('interest');
    }
  }, [readonly, state]);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget as Node)
      ) {
        if (state === 'interest') {
          setInternalState('rest');
        } else if (state === 'edit' && exitOnBlur) {
          exitEditMode();
        }
      }
    },
    [state, exitEditMode, exitOnBlur]
  );

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

  const handleClick = useCallback(() => {
    if (!readonly && (state === 'rest' || state === 'interest')) {
      enterEditMode();
    }
  }, [readonly, state, enterEditMode]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const editModeProps: RenderEditModeProps<T> = {
    value: pendingValue ?? value,
    onSave: handleSave,
    onCancel: handleCancel,
    inputRef: inputRef as React.RefObject<HTMLElement>,
    error,
    clearError,
  };

  const containerClasses = cn(
    'flex flex-col',
    'w-full',
    className
  );

  const labelClasses = cn(
    'text-xs',
    'text-gray-950',
    'tracking-[0.18px]',
    'leading-4',
    'px-1'
  );

  const contentClasses = cn(
    'text-sm',
    'font-medium',
    'text-foreground',
    'tracking-[0.07px]',
    'leading-[21px]',
    'px-1 py-2',
    'rounded',
    'transition-colors duration-150',
    'cursor-pointer',
    !readonly && 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    state === 'interest' && 'bg-gray-200',
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

  const renderContent = () => {
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

    if (state === 'saving') {
      const formatter = formatValue ?? ((v: T) => String(v));
      const savingDisplay = formatter(pendingValue as T);
      
      return (
        <div className={savingClasses}>
          <span>{savingDisplay}</span>
          <Loader2 className="h-3 w-3 animate-spin" aria-label="Saving..." />
        </div>
      );
    }

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
