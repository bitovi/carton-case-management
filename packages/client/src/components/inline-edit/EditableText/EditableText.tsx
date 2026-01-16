/**
 * EditableText Component
 *
 * Inline editable text field for single-line text values.
 * Uses BaseEditable for state management and interaction patterns.
 *
 * @module inline-edit/EditableText
 */
import * as React from 'react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { BaseEditable } from '../BaseEditable';
import { EditControls } from '../EditControls';
import type { ZodSchema } from 'zod';
import type { RenderEditModeProps } from '../types';

export interface EditableTextProps {
  /** Label text displayed above the value */
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
  /** Input type (text, email, url, etc.) */
  type?: 'text' | 'email' | 'url' | 'tel';
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
 * Edit mode renderer for text input
 * 
 * Design specs from Figma (node 1261-9396):
 * - Input: 36px height, 8px border-radius, white background
 * - Input border: 1px solid border color (#e2e8f0)
 * - Input shadow: xs shadow (0px 1px 2px rgba(0,0,0,0.05))
 * - Input padding: 12px horizontal, 7.5px vertical
 * - Controls: 4px gap between buttons
 * - Icon buttons: 36px min size, 8px border-radius, ghost variant
 * - Icons: 16.25px (approximately 4 in Tailwind)
 */
function EditModeRenderer({
  value,
  onSave,
  onCancel,
  inputRef,
  placeholder,
  maxLength,
  type = 'text',
}: RenderEditModeProps<string> & {
  placeholder?: string;
  maxLength?: number;
  type?: 'text' | 'email' | 'url' | 'tel';
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSave(localValue);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [localValue, onSave, onCancel]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    },
    []
  );

  return (
    <div className="relative w-full">
      {/* Input field - Figma: 36px height, 8px radius, border, shadow */}
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'h-9', // 36px
          'rounded-lg', // 8px border-radius
          'px-3 py-[7.5px]', // 12px horizontal, 7.5px vertical
          'text-sm tracking-[0.07px] leading-[21px]', // paragraph/small
          'shadow-xs' // 0px 1px 2px rgba(0,0,0,0.05)
        )}
      />
      {/* Controls - absolute positioned to float over content below */}
      <EditControls onSave={() => onSave(localValue)} onCancel={onCancel} />
    </div>
  );
}

/**
 * EditableText - Inline editable text field
 *
 * A text input component that allows inline editing with
 * keyboard support and visual feedback states.
 *
 * @example
 * ```tsx
 * <EditableText
 *   label="Name"
 *   value={name}
 *   onSave={async (newValue) => {
 *     await api.updateName(newValue);
 *   }}
 * />
 * ```
 */
export function EditableText({
  label,
  value,
  displayValue,
  className,
  readonly = false,
  placeholder,
  maxLength,
  type = 'text',
  isEditing,
  onEditingChange,
  onSave,
  validate,
}: EditableTextProps) {
  // Compute display value with placeholder support
  const computedDisplayValue =
    displayValue !== undefined
      ? displayValue
      : value
        ? value
        : placeholder
          ? <span className="text-muted-foreground italic">{placeholder}</span>
          : <span className="text-muted-foreground italic">Not set</span>;

  return (
    <BaseEditable
      label={label}
      value={value}
      displayValue={computedDisplayValue}
      className={className}
      readonly={readonly}
      isEditing={isEditing}
      onEditingChange={onEditingChange}
      onSave={onSave}
      validate={validate}
      renderEditMode={(props) => (
        <EditModeRenderer
          {...props}
          placeholder={placeholder}
          maxLength={maxLength}
          type={type}
        />
      )}
    />
  );
}

export default EditableText;
