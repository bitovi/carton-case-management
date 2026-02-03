import { cn } from '@/lib/utils';
import { Checkbox } from '../Checkbox';
import type { CheckboxGroupProps } from './types';

export function CheckboxGroup({
  layout = 'inline',
  checked = false,
  label,
  onCheckedChange,
  className,
}: CheckboxGroupProps) {
  const handleCheckedChange = (value: boolean | 'indeterminate') => {
    if (onCheckedChange && typeof value === 'boolean') {
      onCheckedChange(value);
    }
  };

  return (
    <label
      className={cn(
        'flex items-center gap-2 cursor-pointer',
        {
          'inline-flex': layout === 'inline',
          'flex': layout === 'block',
        },
        className
      )}
    >
      <Checkbox checked={checked} onCheckedChange={handleCheckedChange} />
      <span className="text-sm leading-6 text-foreground select-none">{label}</span>
    </label>
  );
}
