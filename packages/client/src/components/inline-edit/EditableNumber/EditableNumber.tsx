/**
 * EditableNumber Component
 *
 * Inline editable number field for numeric values.
 * Uses BaseEditable for state management and interaction patterns.
 *
 * @module inline-edit/EditableNumber
 */
import * as React from 'react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { BaseEditable } from '../BaseEditable';
import { EditControls } from '../EditControls';
import type { ZodSchema } from 'zod';
import type { RenderEditModeProps } from '../types';

export interface EditableNumberProps {
  /** Label text displayed above the value */
  label: string;
  /** Current numeric value */
  value: number | null;
  /** Custom display render (optional) */
  displayValue?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is read-only */
  readonly?: boolean;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Minimum value allowed */
  min?: number;
  /** Maximum value allowed */
  max?: number;
  /** Step increment for the input */
  step?: number;
  /** Controlled editing state */
  isEditing?: boolean;
  /** Callback when editing state changes */
  onEditingChange?: (editing: boolean) => void;
  /** Async save handler */
  onSave: (newValue: number | null) => Promise<void>;
  /** Zod schema or validation function */
  validate?: ZodSchema<number | null> | ((value: number | null) => string | null);
  /** Number of decimal places to display */
  decimalPlaces?: number;
  /** Whether to format number with locale separators */
  useGrouping?: boolean;
}

/**
 * Format a number for display
 */
function formatNumber(
  value: number | null,
  decimalPlaces?: number,
  useGrouping = true
): string {
  if (value === null || value === undefined) return '';
  
  const options: Intl.NumberFormatOptions = {
    useGrouping,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };
  
  return new Intl.NumberFormat('en-US', options).format(value);
}

/**
 * Edit mode renderer for number input
 */
function EditModeRenderer({
  value,
  onSave,
  onCancel,
  inputRef,
  error,
  clearError,
  placeholder,
  min,
  max,
  step,
  label,
}: RenderEditModeProps<number | null> & {
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() ?? '');

  const parseInputValue = (str: string): number | null => {
    if (!str || str.trim() === '') return null;
    const parsed = parseFloat(str);
    return isNaN(parsed) ? null : parsed;
  };

  const handleSaveClick = () => {
    const numericValue = parseInputValue(inputValue);
    onSave(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveClick();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="relative w-full">
      {/* Input field */}
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="number"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (error) clearError();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={cn(
          'h-9', // 36px
          'px-3 py-[7.5px]',
          'rounded-lg',
          'text-sm tracking-[0.07px] leading-[21px]',
          'text-foreground',
          'shadow-sm',
          'w-full',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        aria-label={label}
        aria-invalid={!!error}
      />

      {/* Controls - absolute positioned to float over content below */}
      <EditControls onSave={handleSaveClick} onCancel={onCancel} />
    </div>
  );
}

/**
 * EditableNumber - Inline editable numeric field
 *
 * A number input component that allows inline editing with visual feedback states.
 * Uses BaseEditable for consistent interaction patterns.
 *
 * Design specs from Figma (node 1252-9102):
 * - 3 states: Rest, Hover, Edit
 * - Label: 12px regular, gray-950, 0.18px letter-spacing
 * - Content: 14px regular, foreground, 0.07px letter-spacing
 * - Edit: Input h-9 (36px), px-3 py-[7.5px], rounded-lg, shadow-sm
 * - Controls: check/x icon buttons, 36px min size, 8px padding
 *
 * @example
 * ```tsx
 * <EditableNumber
 *   label="Zip Code"
 *   value={55555}
 *   onSave={async (newValue) => {
 *     await api.updateZipCode(newValue);
 *   }}
 * />
 * ```
 */
export function EditableNumber({
  label,
  value,
  displayValue,
  className,
  readonly = false,
  placeholder = 'Enter number...',
  min,
  max,
  step,
  isEditing,
  onEditingChange,
  onSave,
  validate,
  decimalPlaces,
  useGrouping = false,
}: EditableNumberProps) {
  // Combined validation: user-provided + min/max constraints
  const combinedValidate = useCallback(
    (val: number | null): string | null => {
      // Run user-provided validation first
      if (validate) {
        if (typeof validate === 'function') {
          const error = validate(val);
          if (error) return error;
        } else {
          const result = validate.safeParse(val);
          if (!result.success) {
            return result.error.errors[0]?.message ?? 'Validation failed';
          }
        }
      }

      // Check min/max constraints
      if (val !== null) {
        if (min !== undefined && val < min) {
          return `Value must be at least ${min}`;
        }
        if (max !== undefined && val > max) {
          return `Value must be at most ${max}`;
        }
      }

      return null;
    },
    [validate, min, max]
  );

  // Format value for display (used during saving state)
  const formatValue = useCallback(
    (val: number | null) => formatNumber(val, decimalPlaces, useGrouping),
    [decimalPlaces, useGrouping]
  );

  // Compute display value with placeholder support
  const computedDisplayValue =
    displayValue !== undefined
      ? displayValue
      : value !== null
        ? formatNumber(value, decimalPlaces, useGrouping)
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
      validate={combinedValidate}
      formatValue={formatValue}
      renderEditMode={(props) => (
        <EditModeRenderer
          {...props}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          label={label}
        />
      )}
    />
  );
}

export default EditableNumber;
