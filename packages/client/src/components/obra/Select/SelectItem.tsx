import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SelectItemProps } from './types';

/**
 * SelectItem variants using class-variance-authority
 * Matches Figma design variants for Size and Type
 */
export const selectItemVariants = cva(
  // Base styles
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      /**
       * Size variant from Figma
       * - regular: 32px min height (Figma node: 18:995)
       * - lg: 36px min height (Figma node: 176:26563)
       */
      size: {
        regular: 'min-h-[32px]',
        lg: 'min-h-[36px] py-2',
      },
      /**
       * Type variant from Figma
       * - default: Normal item (Figma node: 18:995)
       * - destructive: Destructive action with red text (Figma node: 68:17850)
       */
      variant: {
        default: '',
        destructive:
          'text-destructive focus:bg-destructive/10 focus:text-destructive',
      },
    },
    defaultVariants: {
      size: 'regular',
      variant: 'default',
    },
  }
);

/**
 * SelectItem component
 *
 * Enhanced item with Figma design variants for size and type.
 * Supports optional description for two-line items.
 *
 * @see https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=281-104714
 *
 * @example
 * <SelectItem value="option1">Option 1</SelectItem>
 *
 * @example
 * // Destructive variant
 * <SelectItem value="delete" variant="destructive">Delete</SelectItem>
 *
 * @example
 * // With description
 * <SelectItem value="premium" description="Best for teams">Premium Plan</SelectItem>
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, size, variant, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(selectItemVariants({ size, variant }), className)}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    {description ? (
      <div className="flex flex-col">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    ) : (
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    )}
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

export { SelectItem };
