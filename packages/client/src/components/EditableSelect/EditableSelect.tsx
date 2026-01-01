import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface EditableSelectOption {
  value: string;
  label: string;
}

interface EditableSelectProps {
  value: string;
  options: EditableSelectOption[];
  onChange: (newValue: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
  alwaysEditing?: boolean;
  triggerClassName?: string;
  displayClassName?: string;
  tooltipText?: string;
}

export function EditableSelect({
  value,
  options,
  onChange,
  className = '',
  disabled = false,
  placeholder = 'Select...',
  allowEmpty = false,
  emptyLabel,
  alwaysEditing = false,
  triggerClassName = '',
  displayClassName = '',
  tooltipText = 'Click to edit',
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: string) => {
    const actualValue = newValue === '__EMPTY__' ? '' : newValue;
    onChange(actualValue);
    if (!alwaysEditing) {
      setIsEditing(false);
    }
  };

  const getDisplayLabel = (val: string) => {
    if (!val && allowEmpty) return emptyLabel || placeholder;
    return options.find((opt) => opt.value === val)?.label || val;
  };

  // Always-editing mode - always show select dropdown
  if (alwaysEditing) {
    return (
      <Select
        value={value || (allowEmpty ? '__EMPTY__' : value)}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className={triggerClassName || 'w-full text-sm'}>
          <SelectValue>{getDisplayLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {allowEmpty && <SelectItem value="__EMPTY__">{emptyLabel || placeholder}</SelectItem>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Inline editing mode - show as text until clicked
  if (!isEditing) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`cursor-pointer rounded px-2 -mx-2 py-1 -my-1 transition-colors hover:bg-gray-100 ${displayClassName} ${className}`}
              onClick={() => !disabled && setIsEditing(true)}
            >
              {getDisplayLabel(value)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Select
      value={value || '__EMPTY__'}
      onValueChange={handleChange}
      disabled={disabled}
      open={isEditing}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
        }
      }}
    >
      <SelectTrigger className={triggerClassName || 'w-full text-sm'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="__EMPTY__">{emptyLabel || placeholder}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
