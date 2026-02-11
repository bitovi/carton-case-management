import { useState } from 'react';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/obra';
import { Checkbox } from '@/components/obra';
import { cn } from '@/lib/utils';
import type { MultiSelectProps } from './types';

const multiSelectTriggerVariants = cva(
  [
    'flex',
    'w-full',
    'border border-solid',
    'rounded-lg',
    'bg-white',
    'border-border',
    'shadow-xs',
    'transition-colors',
    'outline-none',
    'font-normal text-sm leading-[21px] tracking-[0.07px]',
  ],
  {
    variants: {
      size: {
        mini: 'h-8 px-2 gap-1',
        small: 'h-8 px-2 gap-1.5',
        regular: 'h-9 pl-3 pr-2 gap-2',
        large: 'h-10 pl-4 pr-2 gap-3',
      },
      layout: {
        single: 'flex-row items-center',
        stacked: 'flex-row items-center',
      },
      error: {
        false: 'focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]',
        true: 'border-[var(--destructive-border)] focus:border-[var(--destructive-border)] focus:ring-2 focus:ring-[var(--ring-error)]',
      },
    },
    compoundVariants: [
      {
        size: 'regular',
        layout: 'stacked',
        class: 'h-[52px] py-2 px-3',
      },
      {
        size: 'large',
        layout: 'stacked',
        class: 'h-[56px] py-2 px-4',
      },
      {
        size: 'small',
        layout: 'stacked',
        class: 'h-[48px] py-2 px-2',
      },
      {
        size: 'mini',
        layout: 'stacked',
        class: 'h-[43px] py-1.5 px-2',
      },
    ],
    defaultVariants: {
      size: 'regular',
      layout: 'stacked',
      error: false,
    },
  }
);

export function MultiSelect({
  size = 'regular',
  layout = 'stacked',
  label,
  options,
  value = [],
  onChange,
  placeholder = 'None selected',
  prependText,
  leftDecoration,
  error = false,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  
  const handleToggle = (optionValue: string) => {
    if (disabled) return;
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };
  
  const displayValue = value.length === 0
    ? placeholder
    : value.length === 1
    ? options.find(opt => opt.value === value[0])?.label || placeholder
    : `${value.length} selected`;
  
  const displayLabel = label && layout === 'stacked'
    ? value.length > 0 ? `${label} (${value.length})` : `${label} (0)`
    : label;
  
  return (
    <div className={cn('flex flex-col gap-0 w-full', className)}>
      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              multiSelectTriggerVariants({ size, layout, error }),
              disabled && 'opacity-50 cursor-not-allowed',
              !disabled && 'hover:bg-gray-50'
            )}
          >
            <div className={cn(
              'flex flex-1 min-w-0',
              layout === 'stacked' ? 'flex-col items-start gap-0' : 'flex-row items-center gap-2'
            )}>
              {layout === 'single' && (
                <div className="flex flex-1 items-center gap-2 min-w-0">
                  {leftDecoration && (
                    <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                      {leftDecoration}
                    </div>
                  )}

                  {prependText && (
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {prependText}
                    </span>
                  )}

                  <span className="flex-1 truncate text-left">{displayValue}</span>
                </div>
              )}

              {layout === 'stacked' && (
                <>
                  {displayLabel && (
                    <span className="text-xs font-semibold text-muted-foreground tracking-[0.18px] leading-[16px]">
                      {displayLabel}
                    </span>
                  )}

                  <div className="flex items-center gap-2 w-full">
                    {leftDecoration && (
                      <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                        {leftDecoration}
                      </div>
                    )}

                    <span className="flex-1 truncate text-left">{displayValue}</span>
                  </div>
                </>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-1"
          align="start"
        >
          <div className="flex flex-col max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-2 px-3 py-2',
                  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100',
                  'rounded transition-colors'
                )}
              >
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => handleToggle(option.value)}
                  disabled={disabled}
                />
                <span className="text-sm text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
