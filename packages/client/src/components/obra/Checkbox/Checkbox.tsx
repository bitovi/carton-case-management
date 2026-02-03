import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckboxProps } from './types';

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ checked = false, error = false, disabled = false, onCheckedChange, className, ...props }, ref) => {
  const isIndeterminate = checked === 'indeterminate';
  const isChecked = checked === true;
  const isFilled = isChecked || isIndeterminate;

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={isIndeterminate ? 'indeterminate' : isChecked}
      disabled={disabled}
      onCheckedChange={(newChecked) => {
        if (onCheckedChange) {
          if (newChecked === 'indeterminate') {
            onCheckedChange('indeterminate');
          } else {
            onCheckedChange(newChecked);
          }
        }
      }}
      className={cn(
        'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors focus-visible:outline-none',
        {
          'bg-primary border border-primary focus-visible:shadow-[0_0_0_3px_#a3a3a3]': isFilled && !error,
          'bg-input border border-[var(--border-3)] shadow-xs focus-visible:border-[var(--border-5)] focus-visible:shadow-[0_0_0_3px_var(--ring)]': !isFilled && !error,
          'bg-input border border-[var(--destructive-border)] shadow-xs focus-visible:shadow-[0_0_0_3px_var(--ring-error)]': error && !isFilled,
          'bg-destructive border-none focus-visible:shadow-[0_0_0_3px_var(--ring-error)]': error && isFilled,
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
        {isIndeterminate ? (
          <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : (
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';
