import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

/**
 * TooltipProvider props - wraps app or section needing tooltips
 */
export type TooltipProviderProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Provider
>;

/**
 * Tooltip root props
 */
export type TooltipProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Root
>;

/**
 * TooltipTrigger props - the element that triggers tooltip
 */
export type TooltipTriggerProps = React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Trigger
>;

/**
 * TooltipContent props - the tooltip content
 * @figma Obra/Tooltip - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=274-57607
 */
export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * Whether to show the arrow
   * @default true
   */
  showArrow?: boolean;

  /**
   * Side to display tooltip
   * @default 'top'
   * @figma Side: Top | Bottom | Left | Right
   */
  side?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Alignment along the side
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';

  /**
   * Offset from trigger
   * @default 4
   */
  sideOffset?: number;
}
