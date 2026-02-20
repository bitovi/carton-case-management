/**
 * EditableSelect Component
 *
 * Inline editable dropdown/select field for selection from a list of options.
 * Uses BaseEditable for state management and Shadcn Select for the dropdown UI.
 *
 * @module inline-edit/EditableSelect
 */
import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/obra/Select';
import { BaseEditable } from '../BaseEditable';
import type { ZodSchema } from 'zod';
import type { RenderEditModeProps, EditableSelectOption } from '../types';

export interface EditableSelectProps {
  /** Label text displayed above the value */
  label: string;
  /** Current selected value */
  value: string;
  /** List of available options */
  options: EditableSelectOption[];
  /** Custom display render (optional) */
  displayValue?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is read-only */
  readonly?: boolean;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Controlled editing state */
  isEditing?: boolean;
  /** Callback when editing state changes */
  onEditingChange?: (editing: boolean) => void;
  /** Async save handler */
  onSave: (newValue: string) => Promise<void>;
  /** Zod schema or validation function */
  validate?: ZodSchema<string> | ((value: string) => string | null);
  /**
   * If false, skip the "saving" state. Useful with optimistic updates.
   * Defaults to true.
   */
  showSavingState?: boolean;
}

/**
 * Edit mode renderer for select dropdown
 * 
 * Design specs from Figma (node 1065-13212):
 * - Select: 36px min height, 8px border-radius, white background
 * - Select border: 1px solid border color (#cbd5e1)
 * - Select shadow: xs shadow (0px 1px 2px rgba(0,0,0,0.05))
 * - Select padding: 12px left, 8px right, 7.5px vertical
 * - Chevron icon: 16px size, slate-500 color
 */
function EditModeRenderer({
  value,
  onSave,
  onCancel,
  inputRef,
  options,
  placeholder,
}: RenderEditModeProps<string> & {
  options: EditableSelectOption[];
  placeholder?: string;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [isOpen, setIsOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasSelectedRef = useRef(false);

  // Forward ref to trigger
  useEffect(() => {
    if (inputRef && triggerRef.current) {
      (inputRef as React.MutableRefObject<HTMLElement | null>).current =
        triggerRef.current;
    }
  }, [inputRef]);

  const handleValueChange = useCallback(
    (newValue: string) => {
      hasSelectedRef.current = true;
      setLocalValue(newValue);
      // Auto-save on selection
      onSave(newValue);
    },
    [onSave]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open && !hasSelectedRef.current) {
        // Only cancel if closing without making a selection
        onCancel();
      }
    },
    [onCancel]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    },
    [onCancel]
  );

  return (
    <div className="w-full" onKeyDown={handleKeyDown}>
      <Select
        value={localValue}
        onValueChange={handleValueChange}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          ref={triggerRef}
          className={cn(
            'min-h-9', // 36px
            'rounded-lg', // 8px border-radius
            'pl-3 pr-2 py-[7.5px]', // 12px left, 8px right, 7.5px vertical
            'text-sm tracking-[0.07px] leading-[21px]', // paragraph/small
            'shadow-sm', // xs shadow
            'border-slate-300' // Figma: #cbd5e1
          )}
        >
          <SelectValue placeholder={placeholder || 'Select...'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * EditableSelect - Inline editable dropdown field
 *
 * A select component that allows inline editing with
 * keyboard support and visual feedback states.
 *
 * @example
 * ```tsx
 * <EditableSelect
 *   label="Status"
 *   value={status}
 *   options={[
 *     { value: 'active', label: 'Active' },
 *     { value: 'inactive', label: 'Inactive' },
 *   ]}
 *   onSave={async (newValue) => {
 *     await api.updateStatus(newValue);
 *   }}
 * />
 * ```
 */
export function EditableSelect({
  label,
  value,
  options,
  displayValue,
  className,
  readonly = false,
  placeholder,
  isEditing,
  onEditingChange,
  onSave,
  validate,
  showSavingState = true,
}: EditableSelectProps) {
  // Find the label for the current value
  const selectedOption = options.find((opt) => opt.value === value);

  // Compute display value
  const computedDisplayValue =
    displayValue !== undefined
      ? displayValue
      : selectedOption
        ? selectedOption.label
        : placeholder
          ? <span className="text-muted-foreground italic">{placeholder}</span>
          : <span className="text-muted-foreground italic">Not selected</span>;

  // Format value to label (used during saving state)
  const formatValue = useCallback(
    (val: string) => {
      const option = options.find((opt) => opt.value === val);
      return option ? option.label : val;
    },
    [options]
  );

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
      exitOnBlur={false} // Select uses portal, blur happens when clicking dropdown
      showSavingState={showSavingState}
      formatValue={formatValue}
      renderEditMode={(props) => (
        <EditModeRenderer
          {...props}
          options={options}
          placeholder={placeholder}
        />
      )}
    />
  );
}

export default EditableSelect;
