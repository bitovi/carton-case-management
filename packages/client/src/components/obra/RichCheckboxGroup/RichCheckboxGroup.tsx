import { cn } from '@/lib/utils';
import { Checkbox } from '../Checkbox';
import type { RichCheckboxGroupProps } from './types';

export function RichCheckboxGroup({
  checked = false,
  flipped = false,
  showLine2 = false,
  label,
  secondaryText,
  onCheckedChange,
  className,
}: RichCheckboxGroupProps) {
  const handleCheckedChange = (value: boolean | 'indeterminate') => {
    if (onCheckedChange && typeof value === 'boolean') {
      onCheckedChange(value);
    }
  };
  const labelContent = (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm leading-5 text-foreground select-none">{label}</span>
      {showLine2 && secondaryText && (
        <span className="text-sm leading-5 text-muted-foreground select-none">
          {secondaryText}
        </span>
      )}
    </div>
  );

  return (
    <label
      className={cn(
        'flex items-center cursor-pointer border border-border rounded-lg p-3 w-60',
        {
          'justify-between': flipped,
          'gap-2': !flipped,
        },
        className
      )}
    >
      {flipped ? (
        <>
          {labelContent}
          <Checkbox checked={checked} onCheckedChange={handleCheckedChange} />
        </>
      ) : (
        <>
          <Checkbox checked={checked} onCheckedChange={handleCheckedChange} />
          {labelContent}
        </>
      )}
    </label>
  );
}
