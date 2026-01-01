import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface EditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  isLoading?: boolean;
}

export function EditableTitle({
  value,
  onSave,
  className = '',
  inputClassName = '',
  isLoading = false,
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedValue(value);
  }, [value]);

  const handleSave = () => {
    const trimmedValue = editedValue.trim();
    if (trimmedValue === '' || trimmedValue === value) {
      handleCancel();
      return;
    }
    onSave(trimmedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
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
              {value}
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
    <div className="relative">
      <Input
        ref={inputRef}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          // Don't blur if clicking on buttons
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (relatedTarget?.closest('.edit-actions')) {
            return;
          }
          handleCancel();
        }}
        disabled={isLoading}
        className={inputClassName}
      />
      <div className="edit-actions absolute top-full right-0 mt-1 flex gap-1 z-10">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-green-100"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 hover:bg-red-100"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    </div>
  );
}
