import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

interface EditableSelectProps {
  value: string;
  options: Array<{ id: string; name: string }>;
  onSave: (newValue: string) => void;
  className?: string;
  isLoading?: boolean;
  placeholder?: string;
  allowEmpty?: boolean;
}

export function EditableSelect({
  value,
  options,
  onSave,
  className = '',
  isLoading = false,
  placeholder = 'Select...',
  allowEmpty = false,
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (newValue: string) => {
    // Always save the change, even if changing from empty to a value
    onSave(newValue);
    setIsEditing(false);
  };

  const getDisplayLabel = (val: string) => {
    if (!val && allowEmpty) return placeholder;
    return options.find((opt) => opt.id === val)?.name || val;
  };

  if (!isEditing) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`cursor-pointer rounded px-2 -mx-2 py-1 -my-1 transition-colors hover:bg-gray-100 ${className}`}
              onClick={() => setIsEditing(true)}
            >
              {getDisplayLabel(value)}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to edit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Select
      value={value || '__EMPTY__'}
      onValueChange={(newValue) => {
        const actualValue = newValue === '__EMPTY__' ? '' : newValue;
        handleChange(actualValue);
      }}
      disabled={isLoading}
      open={isEditing}
      onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
        }
      }}
    >
      <SelectTrigger className="w-full text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="__EMPTY__">{placeholder}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
