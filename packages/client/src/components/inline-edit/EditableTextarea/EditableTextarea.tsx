/**
 * EditableTextarea Component
 *
 * Inline editable textarea for multi-line text values.
 * Unlike other editable components, this has only 2 states (Rest/Edit)
 * with NO hover state, and uses text buttons (Save/Cancel) instead of icons.
 *
 * @module inline-edit/EditableTextarea
 */
import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { ZodSchema } from 'zod';

export interface EditableTextareaProps {
  /** Label text displayed above the textarea */
  label: string;
  /** Current text value */
  value: string;
  /** Custom display render (optional) */
  displayValue?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is read-only */
  readonly?: boolean;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Maximum length of input */
  maxLength?: number;
  /** Minimum height for the textarea in pixels */
  minHeight?: number;
  /** Controlled editing state */
  isEditing?: boolean;
  /** Callback when editing state changes */
  onEditingChange?: (editing: boolean) => void;
  /** Async save handler */
  onSave: (newValue: string) => Promise<void>;
  /** Zod schema or validation function */
  validate?: ZodSchema<string> | ((value: string) => string | null);
}

/**
 * Validates a value using either a Zod schema or a custom validation function.
 */
function validateValue(
  value: string,
  validate?: ZodSchema<string> | ((value: string) => string | null)
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
 * EditableTextarea - Inline editable multi-line text field
 *
 * A textarea component that allows inline editing with save/cancel
 * buttons and visual feedback states.
 *
 * Design specs from Figma (node 853-1802):
 * - Only 2 states: Rest and Edit (NO Hover state)
 * - Label: 16px semibold, gray-950
 * - Rest content: 14px regular, 21px line-height, 0.07px letter-spacing
 * - Gap (Rest): 8px between label and content
 * - Gap (Edit): 16px between elements
 * - Textarea: min-height 68px, white bg, gray-100 border, 5px padding
 * - Save button: teal-600 (#00848b) bg, white text, 36px min-height
 * - Cancel button: white bg, gray-700 text, 36px min-height
 * - Button gap: 8px
 *
 * @example
 * ```tsx
 * <EditableTextarea
 *   label="Description"
 *   value={description}
 *   onSave={async (newValue) => {
 *     await api.updateDescription(newValue);
 *   }}
 *   placeholder="Enter description..."
 * />
 * ```
 */
export function EditableTextarea({
  label,
  value,
  displayValue,
  className,
  readonly = false,
  placeholder,
  maxLength,
  minHeight = 68,
  isEditing: controlledIsEditing,
  onEditingChange,
  onSave,
  validate,
}: EditableTextareaProps) {
  // Determine if we're in controlled mode
  const isControlled = controlledIsEditing !== undefined;

  // Internal state management
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  // Refs for focus management
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute the current editing state
  const isEditing = isControlled ? controlledIsEditing : internalIsEditing;

  /**
   * Enter edit mode
   */
  const enterEditMode = useCallback(() => {
    if (readonly) return;

    setEditValue(value);
    setError(null);

    if (isControlled) {
      onEditingChange?.(true);
    } else {
      setInternalIsEditing(true);
    }
  }, [readonly, value, isControlled, onEditingChange]);

  /**
   * Exit edit mode
   */
  const exitEditMode = useCallback(() => {
    if (isControlled) {
      onEditingChange?.(false);
    } else {
      setInternalIsEditing(false);
    }
    setError(null);
  }, [isControlled, onEditingChange]);

  /**
   * Handle save
   */
  const handleSave = useCallback(async () => {
    // Validate before saving
    const validationError = validateValue(editValue, validate);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(editValue);
      exitEditMode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  }, [editValue, validate, onSave, exitEditMode]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    setEditValue(value);
    exitEditMode();
  }, [value, exitEditMode]);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Escape to cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
      // Ctrl/Cmd + Enter to save
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSave();
      }
    },
    [handleCancel, handleSave]
  );

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Sync edit value when external value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Label classes (from Figma: 16px semibold)
  const labelClasses = cn(
    'font-semibold',
    'text-base', // 16px
    'leading-6', // 24px
    'tracking-normal', // 0px
    'text-gray-950' // #192627
  );

  // Content classes for rest state (from Figma: 14px regular)
  const contentClasses = cn(
    'text-sm', // 14px
    'text-foreground', // #020617
    'tracking-[0.07px]',
    'leading-[21px]',
    'whitespace-pre-wrap'
  );

  // Error message classes
  const errorClasses = cn('text-xs text-destructive mt-1');

  // Render edit mode
  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className={cn('flex flex-col gap-4', className)} // 16px gap in edit mode
      >
        {/* Label */}
        <span className={labelClasses}>{label}</span>

        {/* Textarea container */}
        <div className="flex flex-col w-full">
          <Textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={isSaving}
            style={{ minHeight: `${minHeight}px` }}
            className={cn(
              'w-full',
              'p-[5px]', // 5px padding from Figma
              'rounded-lg', // 8px border-radius
              'bg-white',
              'border-gray-100', // #f4f5f5
              'shadow-sm', // xs shadow
              'text-sm tracking-[0.07px] leading-[21px]',
              'text-gray-950', // #192627
              'resize-y'
            )}
            aria-label={label}
            aria-invalid={!!error}
          />
          {error && (
            <span className={errorClasses} role="alert">
              {error}
            </span>
          )}
        </div>

        {/* Buttons container - 8px gap between buttons */}
        <div className="flex items-start gap-2">
          {/* Save button - teal-600 bg, white text */}
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              'min-h-9', // 36px
              'px-4 py-[7.5px]', // 16px horizontal, 7.5px vertical
              'rounded-lg', // 8px border-radius
              'bg-teal-600 hover:bg-teal-700', // #00848b
              'text-white',
              'text-sm font-semibold',
              'tracking-[0.07px] leading-[21px]'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>

          {/* Cancel button - white bg, gray-700 text */}
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className={cn(
              'min-h-9', // 36px
              'px-4 py-[7.5px]', // 16px horizontal, 7.5px vertical
              'rounded-lg', // 8px border-radius
              'bg-white',
              'text-gray-700', // #4c5b5c
              'text-sm font-semibold',
              'tracking-[0.07px] leading-[21px]',
              'border-0'
            )}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Render rest state (NO hover state for textarea)
  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col gap-2', className)} // 8px gap in rest mode
      onClick={!readonly ? enterEditMode : undefined}
      role={readonly ? undefined : 'button'}
      tabIndex={readonly ? -1 : 0}
      onKeyDown={
        readonly
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                enterEditMode();
              }
            }
      }
      aria-label={readonly ? undefined : `Edit ${label}`}
      style={{ cursor: readonly ? 'default' : 'pointer' }}
    >
      {/* Label */}
      <span className={labelClasses}>{label}</span>

      {/* Content */}
      <div className={contentClasses}>
        {displayValue ?? (value || (
          <span className="text-muted-foreground italic">{placeholder}</span>
        ))}
      </div>
    </div>
  );
}

export default EditableTextarea;
