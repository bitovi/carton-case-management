/**
 * EditableDate Component
 *
 * Inline editable date field using a calendar picker.
 * Uses BaseEditable for state management and interaction patterns.
 * Auto-saves on date selection (no explicit save/cancel buttons).
 *
 * @module inline-edit/EditableDate
 */
import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { BaseEditable } from '../BaseEditable';
import type { ZodSchema } from 'zod';
import type { RenderEditModeProps } from '../types';

export interface EditableDateProps {
  /** Label text displayed above the date field */
  label: string;
  /** Current date value (ISO string or Date object) */
  value: string | Date | null;
  /** Format for displaying the date (default: "MMM d, yyyy") */
  displayFormat?: string;
  /** Custom display render (optional) */
  displayValue?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the field is read-only */
  readonly?: boolean;
  /** Placeholder text when value is empty */
  placeholder?: string;
  /** Controlled editing state */
  isEditing?: boolean;
  /** Callback when editing state changes */
  onEditingChange?: (editing: boolean) => void;
  /** Async save handler - called immediately when date is selected */
  onSave: (newValue: string) => Promise<void>;
  /** Zod schema or validation function */
  validate?: ZodSchema<string> | ((value: string) => string | null);
}

/**
 * Parse a date from string or Date object
 */
function parseDate(value: string | Date | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;

  // Try ISO format first
  const isoDate = new Date(value);
  if (isValid(isoDate)) return isoDate;

  // Try common formats
  const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'MMM d, yyyy'];
  for (const fmt of formats) {
    try {
      const parsed = parse(value, fmt, new Date());
      if (isValid(parsed)) return parsed;
    } catch {
      // Continue to next format
    }
  }

  return undefined;
}

/**
 * Edit mode renderer for date picker
 * 
 * Design specs from Figma (node 1252-8939):
 * - Date picker input with calendar icon on left
 * - Auto-saves on date selection (no save/cancel buttons)
 * - Input: 36px height, 8px border-radius, white background
 * - Calendar icon: 20px size, slate-500 color
 */
function EditModeRenderer({
  value,
  onSave,
  onCancel,
  inputRef,
  placeholder,
  displayFormat,
}: RenderEditModeProps<string> & {
  placeholder: string;
  displayFormat: string;
}) {
  const [popoverOpen, setPopoverOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hasSelectedRef = useRef(false);

  // Parse the value to a Date object for the calendar
  const dateValue = parseDate(value);

  // Forward ref to trigger
  useEffect(() => {
    if (inputRef && triggerRef.current) {
      (inputRef as React.MutableRefObject<HTMLElement | null>).current =
        triggerRef.current;
    }
  }, [inputRef]);

  // Format for display in the trigger button
  const formattedValue = dateValue ? format(dateValue, displayFormat) : null;

  const handleDateSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      hasSelectedRef.current = true;
      // Format date as ISO string for storage
      const isoValue = format(selectedDate, 'yyyy-MM-dd');
      // Auto-save on selection
      onSave(isoValue);
    },
    [onSave]
  );

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      setPopoverOpen(open);
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
      <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            className={cn(
              'w-full flex gap-1.5 items-center min-h-9 overflow-clip',
              'px-2 py-[7.5px] rounded-lg',
              'bg-white border border-slate-300',
              'shadow-sm',
              'text-sm tracking-[0.07px] leading-[21px]',
              'text-foreground'
            )}
            aria-label="Select date"
          >
            <CalendarIcon className="h-5 w-5 text-slate-500 shrink-0" />
            <span className="flex-1 text-left">
              {formattedValue || (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/**
 * EditableDate - Inline editable date field
 *
 * A date picker component that allows inline editing with auto-save
 * on selection. Uses BaseEditable for consistent interaction patterns.
 *
 * Design specs from Figma (node 1252-8939):
 * - 3 states: Rest, Hover, Edit
 * - Label: 12px regular, gray-950, with 0.18px letter-spacing
 * - Content: 14px regular, foreground, 0.07px letter-spacing
 * - Rest/Hover: px-4 py-2, hover bg-gray-200, rounded-md
 * - Edit: date picker input with calendar icon on left
 * - Auto-saves on date selection (no save/cancel buttons)
 *
 * @example
 * ```tsx
 * <EditableDate
 *   label="Due Date"
 *   value="2025-01-20"
 *   onSave={async (newValue) => {
 *     await api.updateDueDate(newValue);
 *   }}
 * />
 * ```
 */
export function EditableDate({
  label,
  value,
  displayFormat = 'MMM d, yyyy',
  displayValue,
  className,
  readonly = false,
  placeholder = 'Select date',
  isEditing,
  onEditingChange,
  onSave,
  validate,
}: EditableDateProps) {
  // Normalize value to string for BaseEditable
  const normalizedValue = React.useMemo(() => {
    if (value === null) return '';
    if (value instanceof Date) {
      return isValid(value) ? format(value, 'yyyy-MM-dd') : '';
    }
    return value;
  }, [value]);

  // Parse the incoming value to a Date object for display
  const dateValue = parseDate(value);

  // Format the display value
  const formattedValue = dateValue ? format(dateValue, displayFormat) : null;

  // Compute display value with placeholder support
  const computedDisplayValue =
    displayValue !== undefined
      ? displayValue
      : formattedValue
        ? formattedValue
        : placeholder
          ? <span className="text-muted-foreground italic">{placeholder}</span>
          : <span className="text-muted-foreground italic">Not set</span>;

  // Format value for saving state display
  const formatValue = useCallback(
    (val: string) => {
      const parsed = parseDate(val);
      return parsed ? format(parsed, displayFormat) : val;
    },
    [displayFormat]
  );

  return (
    <BaseEditable
      label={label}
      value={normalizedValue}
      displayValue={computedDisplayValue}
      className={className}
      readonly={readonly}
      isEditing={isEditing}
      onEditingChange={onEditingChange}
      onSave={onSave}
      validate={validate}
      exitOnBlur={false} // Date picker uses popover, blur happens when clicking calendar
      formatValue={formatValue}
      renderEditMode={(props) => (
        <EditModeRenderer
          {...props}
          placeholder={placeholder}
          displayFormat={displayFormat}
        />
      )}
    />
  );
}

export default EditableDate;
