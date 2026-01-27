import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectOverflowIndicatorProps,
} from './types';


export const Select = SelectPrimitive.Root;

export const SelectValue = SelectPrimitive.Value;


 
const selectTriggerVariants = cva(
  [
    'flex',
    'w-full',
    'border border-solid',
    'rounded-lg',
    'bg-white',
    'border-[var(--border-3)]',
    'shadow-xs',
    'transition-colors',
    'outline-none',
    'font-normal text-sm leading-[21px] tracking-[0.07px]',
    'data-[placeholder]:text-muted-foreground',
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
      layout: 'single',
      error: false,
    },
  }
);

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps & VariantProps<typeof selectTriggerVariants>
>(({
  size = 'regular',
  layout = 'single',
  label,
  prependText,
  leftDecoration,
  error = false,
  disabled,
  className,
  children,
  ...props
}, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectTriggerVariants({ size, layout, error }),
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
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

            <span className="flex-1 truncate text-left">{children}</span>
          </div>
        )}

        {layout === 'stacked' && (
          <>
            {label && (
              <span className="text-xs font-semibold text-muted-foreground tracking-[0.18px] leading-[16px]">
                {label}
              </span>
            )}

            <div className="flex items-center gap-2 w-full">
              {leftDecoration && (
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {leftDecoration}
                </div>
              )}

              <span className="flex-1 truncate text-left">{children}</span>
            </div>
          </>
        )}
      </div>

      <SelectPrimitive.Icon className="shrink-0">
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

const selectContentVariants = cva(
  [
    'bg-white',
    'border border-solid border-[var(--border-3)]',
    'rounded-lg',
    'shadow-md',
    'overflow-hidden',
    'z-50',
    'w-full',
    'min-w-[var(--radix-select-trigger-width)]',
  ],
  {
    variants: {
      spacing: {
        none: 'p-0',
        '2px': 'p-0.5',
        '8px': 'p-2',
        '16px': 'p-4',
        '24px': 'p-6',
      },
    },
    defaultVariants: {
      spacing: 'none',
    },
  }
);

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps & VariantProps<typeof selectContentVariants>
>(({
  spacing = 'none',
  className,
  children,
  position = 'popper',
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}, ref) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(selectContentVariants({ spacing }), className)}
        position={position}
        side={side}
        align={align}
        sideOffset={sideOffset}
        {...props}
      >
        <SelectPrimitive.Viewport className="w-full">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

SelectContent.displayName = 'SelectContent';

const selectItemVariants = cva(
  [
    'relative flex items-center gap-2',
    'w-full',
    'cursor-pointer select-none',
    'outline-none',
    'transition-colors',
    'text-sm leading-[21px] tracking-[0.07px]',
    'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
  ],
  {
    variants: {
      size: {
        regular: 'h-8 px-2',
        large: 'h-9 px-3',
      },
      type: {
        default: [
          'text-foreground',
          'hover:bg-[var(--accent)]',
          'focus:bg-[var(--accent)]',
          'data-[state=checked]:bg-[var(--accent)]',
        ],
        destructive: [
          'text-[var(--destructive-foreground)]',
          'hover:bg-[var(--destructive-subtle)]',
          'focus:bg-[var(--destructive-subtle)]',
          'data-[state=checked]:bg-[var(--destructive-subtle)]',
        ],
      },
    },
    defaultVariants: {
      size: 'regular',
      type: 'default',
    },
  }
);

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps & VariantProps<typeof selectItemVariants>
>(({
  size = 'regular',
  type = 'default',
  leftDecoration,
  rightDecoration,
  disabled,
  description,
  className,
  children,
  ...props
}, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(selectItemVariants({ size, type }), className)}
      disabled={disabled}
      {...props}
    >
      {leftDecoration && (
        <div className="shrink-0 w-5 h-5 flex items-center justify-center">
          {leftDecoration}
        </div>
      )}

      <div className="flex flex-1 flex-col items-start min-w-0">
        <SelectPrimitive.ItemText className="truncate">
          {children}
        </SelectPrimitive.ItemText>
        {description && (
          <span className="text-xs text-muted-foreground truncate">
            {description}
          </span>
        )}
      </div>

      {rightDecoration && (
        <div className="shrink-0 w-4 h-4 flex items-center justify-center">
          {rightDecoration}
        </div>
      )}

      <SelectPrimitive.ItemIndicator className="shrink-0 w-4 h-4 flex items-center justify-center">
        <Check className="w-4 h-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = 'SelectItem';

const selectLabelVariants = cva(
  [
    'font-semibold',
    'text-muted-foreground',
    'py-1.5',
  ],
  {
    variants: {
      size: {
        small: 'text-xs px-2',
        regular: 'text-sm px-2',
      },
      indented: {
        false: '',
        true: 'pl-8',
      },
    },
    defaultVariants: {
      size: 'small',
      indented: false,
    },
  }
);

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps & VariantProps<typeof selectLabelVariants>
>(({
  size = 'small',
  indented = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn(selectLabelVariants({ size, indented }), className)}
      {...props}
    >
      {children}
    </SelectPrimitive.Label>
  );
});

SelectLabel.displayName = 'SelectLabel';

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('h-px bg-border my-1', className)}
      {...props}
    />
  );
});

SelectSeparator.displayName = 'SelectSeparator';

export const SelectOverflowIndicator: React.FC<SelectOverflowIndicatorProps> = ({
  direction,
  className,
}) => {
  const Icon = direction === 'up' ? ChevronUp : ChevronDown;
  
  return (
    <div className={cn('flex items-center justify-center h-4 text-muted-foreground', className)}>
      <Icon className="w-4 h-4" />
    </div>
  );
};

SelectOverflowIndicator.displayName = 'SelectOverflowIndicator';

export type {
  SelectProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectOverflowIndicatorProps,
};
