import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { LabelProps } from './types';

/**
 * Label variants using class-variance-authority
 * Matches Figma design tokens for typography and layout
 */
export const labelVariants = cva(
  // Base styles matching Figma design tokens
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      /**
       * Layout variant from Figma
       * - block: Default block-level label (Figma node: 16:1663)
       * - inline: Inline label for checkboxes/radios (Figma node: 103:9452)
       */
      layout: {
        block: 'block',
        inline: 'inline',
      },
    },
    defaultVariants: {
      layout: 'block',
    },
  }
);

/**
 * Label component
 *
 * Renders an accessible label associated with form controls.
 * Built on Radix UI Label primitive for accessibility.
 *
 * @see https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=279-98209
 *
 * @example
 * // Block layout (default)
 * <Label htmlFor="email">Email address</Label>
 *
 * @example
 * // Inline layout for checkboxes
 * <Label htmlFor="terms" layout="inline">Accept terms</Label>
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, layout, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(labelVariants({ layout }), className)}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };
