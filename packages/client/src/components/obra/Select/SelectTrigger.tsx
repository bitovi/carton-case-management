import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SelectTriggerProps } from './types';

/**
 * SelectTrigger variants using class-variance-authority
 * Matches Figma design variants for Size, State, and Lines
 */
export const selectTriggerVariants = cva(
  // Base styles
  'flex w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 data-[placeholder]:text-muted-foreground',
  {
    variants: {
      /**
       * Size variant from Figma
       * - default: 36px height (Figma node: 16:1730)
       * - lg: 40px height (Figma node: 19:1478)
       * - sm: 32px height (Figma node: 19:1574)
       * - mini: 32px with smaller text (Figma node: 281:105885)
       */
      size: {
        default: 'h-9 py-2',
        lg: 'h-10 py-2',
        sm: 'h-8 py-1.5',
        mini: 'h-8 py-1.5 text-xs',
      },
      /**
       * Visual state variant from Figma
       * - default: Normal state (Figma node: 16:1730)
       * - error: Error state with red border (Figma node: 18:980)
       */
      state: {
        default: '',
        error: 'border-destructive focus:ring-destructive',
      },
      /**
       * Lines variant from Figma
       * - single: Single line of text (Figma node: 16:1730)
       * - double: Two lines of text (Figma node: 68:17940)
       */
      lines: {
        single: '',
        double: 'h-auto min-h-[52px] py-2 [&>span]:line-clamp-2',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
      lines: 'single',
    },
  }
);

/**
 * SelectTrigger component
 *
 * Enhanced trigger with Figma design variants for size, state, and lines.
 * Built on Radix UI Select primitive for accessibility.
 *
 * @see https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281-104714
 *
 * @example
 * <SelectTrigger size="default">
 *   <SelectValue placeholder="Select an item" />
 * </SelectTrigger>
 *
 * @example
 * // Large size with error state
 * <SelectTrigger size="lg" state="error">
 *   <SelectValue placeholder="Required field" />
 * </SelectTrigger>
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, size, state, lines, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(selectTriggerVariants({ size, state, lines }), className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
