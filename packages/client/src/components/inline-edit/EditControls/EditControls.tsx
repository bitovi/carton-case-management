import { Check, X } from 'lucide-react';
import { Button } from '@/components/obra/Button';
import { cn } from '@/lib/utils';

/**
 * Figma Spec Reference:
 * - Button size: 36px min (h-9/w-9)
 * - Border radius: 8px (rounded-lg)
 * - Padding: 8px (p-2)
 * - Shadow: shadow-sm (0px 1px 3px rgba(0,0,0,0.1))
 * - Border: 1px solid gray-200
 * - Save icon: Check in green-600
 * - Cancel icon: X in red-600
 * - Position: Floats below input, right-aligned
 */

export interface EditControlsProps {
  /** Called when save button is clicked */
  onSave: () => void;
  /** Called when cancel button is clicked */
  onCancel: () => void;
  /** Additional class names for the container */
  className?: string;
}

/**
 * EditControls - Floating save/cancel buttons for inline edit components
 *
 * Provides consistent save (check) and cancel (x) buttons that float
 * below the edit input. Used by EditableText, EditableNumber,
 * EditableCurrency, and EditablePercent components.
 */
export function EditControls({ onSave, onCancel, className }: EditControlsProps) {
  return (
    <div
      className={cn(
        'absolute right-0 top-full mt-1',
        'flex gap-1 items-start justify-end z-10',
        className
      )}
    >
      {/* Save button (check) */}
      <Button
        type="button"
        variant="ghost"
        size="mini"
        onClick={onSave}
        className={cn(
          'min-h-9 min-w-9', // 36px
          'p-2', // 8px
          'rounded-lg',
          'bg-background border border-gray-200 shadow-sm',
          'text-green-600 hover:text-green-700 hover:bg-green-50'
        )}
        aria-label="Save"
      >
        <Check className="h-4 w-4" />
      </Button>

      {/* Cancel button (x) */}
      <Button
        type="button"
        variant="ghost"
        size="mini"
        onClick={onCancel}
        className={cn(
          'min-h-9 min-w-9', // 36px
          'p-2', // 8px
          'rounded-lg',
          'bg-background border border-gray-200 shadow-sm',
          'text-red-600 hover:text-red-700 hover:bg-red-50'
        )}
        aria-label="Cancel"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
