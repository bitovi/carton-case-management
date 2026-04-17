import type { FocusEvent, KeyboardEvent } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import { Input } from '@/components/obra/Input';
import { EditableState } from '../types';

export interface EditableTitleProps {
  /** The current title value */
  value: string;
  /** Callback when the title is saved */
  onSave: (value: string) => Promise<void>;
  /** Optional validation function */
  validate?: (value: string) => string | null;
  /** Optional placeholder text for empty state */
  placeholder?: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional readonly mode */
  readonly?: boolean;
  /** Optional controlled editing state */
  isEditing?: boolean;
  /** Optional callback when editing state changes */
  onEditingChange?: (isEditing: boolean) => void;
}

/**
 * EditableTitle - Inline editable title/heading component
 *
 * A specialized component for editing page/section titles with
 * heading typography in display mode and input field in edit mode.
 *
 * Design specs from Figma (node 1109-12982 / InlineEditTitle):
 * - Rest/Hover state: heading-2 font (30px, semibold, -1px letter-spacing, 30px line-height)
 * - Font color: gray-950 (#192627)
 * - Edit state: Input field (36px min-height, 8px border-radius, 320px width)
 * - Controls: Check and X icons (36px min size, ghost variant)
 *
 * @example
 * ```tsx
 * <EditableTitle
 *   value={caseTitle}
 *   onSave={async (newTitle) => {
 *     await api.updateCase(caseId, { title: newTitle });
 *   }}
 *   validate={(value) => {
 *     if (value.length < 3) return 'Title must be at least 3 characters';
 *     return null;
 *   }}
 * />
 * ```
 */
export function EditableTitle({
  value,
  onSave,
  validate,
  placeholder = 'Enter title...',
  className,
  readonly = false,
  isEditing: controlledIsEditing,
  onEditingChange,
}: EditableTitleProps) {
  const isControlled = controlledIsEditing !== undefined;

  const [internalState, setInternalState] = useState<EditableState>('rest');
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isEditing = isControlled ? controlledIsEditing : internalState === 'edit';
  const isSaving = internalState === 'saving';

  const state: EditableState = isSaving
    ? 'saving'
    : isEditing
      ? 'edit'
      : internalState;

  const enterEditMode = useCallback(() => {
    if (readonly) return;

    setEditValue(value);
    setError(null);

    if (isControlled) {
      onEditingChange?.(true);
    } else {
      setInternalState('edit');
    }
  }, [readonly, value, isControlled, onEditingChange]);

  const exitEditMode = useCallback(() => {
    setEditValue(value);
    setError(null);

    if (isControlled) {
      onEditingChange?.(false);
    } else {
      setInternalState('rest');
    }
  }, [value, isControlled, onEditingChange]);

  const handleSave = useCallback(async () => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (editValue === value) {
      exitEditMode();
      return;
    }

    setInternalState('saving');

    try {
      await onSave(editValue);
      if (isControlled) {
        onEditingChange?.(false);
      }
      setInternalState('rest');
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
  }, [editValue, value, validate, onSave, exitEditMode, isControlled, onEditingChange]);

  const handleCancel = useCallback(() => {
    exitEditMode();
  }, [exitEditMode]);

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
    (e: FocusEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget as Node)
      ) {
        if (state === 'interest') {
          setInternalState('rest');
        }
      }
    },
    [state]
  );

  const handleClick = useCallback(() => {
    if (!readonly && (state === 'rest' || state === 'interest')) {
      enterEditMode();
    }
  }, [readonly, state, enterEditMode]);

  const handleTitleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((state === 'rest' || state === 'interest') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        enterEditMode();
      }
    },
    [state, enterEditMode]
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const titleClasses = cn(
    'font-semibold',
    'text-[30px]',
    'leading-[30px]',
    'tracking-[-1px]',
    'text-gray-950',
    'rounded',
    'px-1 py-0.5',
    'transition-colors duration-150',
    'cursor-pointer',
    !readonly && 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    state === 'interest' && 'bg-gray-200',
    readonly && 'cursor-default'
  );

  const savingClasses = cn(
    titleClasses,
    'flex items-center gap-2',
    'cursor-wait'
  );

  const errorClasses = cn('text-xs text-destructive mt-1');

  if (isEditing) {
    return (
      <div ref={containerRef} className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-center gap-1">
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            className={cn(
              'min-h-9',
              'w-80',
              'rounded-lg',
              'px-3 py-[7.5px]',
              'text-sm tracking-[0.07px] leading-[21px]',
              'shadow-sm',
              'border-slate-300'
            )}
            aria-label="Edit title"
            aria-invalid={!!error}
          />
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="mini"
              onClick={handleSave}
              disabled={isSaving}
              aria-label="Save title"
              className="min-h-9 min-w-9"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="mini"
              onClick={handleCancel}
              disabled={isSaving}
              aria-label="Cancel editing"
              className="min-h-9 min-w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {error && (
          <span className={errorClasses} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  if (isSaving) {
    return (
      <div ref={containerRef} className={className}>
        <div className={savingClasses}>
          <span>{editValue || placeholder}</span>
          <Loader2 className="h-5 w-5 animate-spin" aria-label="Saving..." />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} onBlur={handleBlur}>
      <h1
        className={titleClasses}
        tabIndex={readonly ? -1 : 0}
        aria-label={readonly ? undefined : `Click to edit: ${value || placeholder}`}
        aria-readonly={readonly}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={handleTitleKeyDown}
      >
        {value || (
          <span className="text-muted-foreground italic">{placeholder}</span>
        )}
      </h1>
    </div>
  );
}

export default EditableTitle;
