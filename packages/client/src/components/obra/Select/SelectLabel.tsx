import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import type { SelectLabelProps } from './types';

/**
 * SelectLabel variants using class-variance-authority
 * Matches Figma design variants for Size and Indented
 */
export const selectLabelVariants = cva(
  // Base styles
  'py-1.5 font-semibold text-muted-foreground',
  {
    variants: {
      /**
       * Size variant from Figma
       * - sm: Small label text (Figma node: 18:998)
       * - default: Regular label text (Figma node: 80:10194)
       */
      size: {
        sm: 'text-xs',
        default: 'text-sm',
      },
      /**
       * Indented variant from Figma
       * - false: Not indented, standard padding (Figma node: 18:998)
       * - true: Indented for nested groups (Figma node: 80:10188)
       */
      indented: {
        true: 'pl-8',
        false: 'px-2',
      },
    },
    defaultVariants: {
      size: 'default',
      indented: false,
    },
  }
);

/**
 * SelectLabel component
 *
 * Enhanced group label with Figma design variants for size and indentation.
 * Used as a header for groups of SelectItems.
 *
 * @see https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281-104714
 *
 * @example
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 * </SelectGroup>
 *
 * @example
 * // Small indented label
 * <SelectLabel size="sm" indented>Subcategory</SelectLabel>
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, size, indented, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(selectLabelVariants({ size, indented }), className)}
    {...props}
  />
));
SelectLabel.displayName = 'SelectLabel';

export { SelectLabel };
