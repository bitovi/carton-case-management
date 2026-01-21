import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';
import type { TooltipContentProps } from './types';

/**
 * TooltipProvider - Wraps app or section needing tooltips.
 * Provides shared delay and skip duration settings.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip - The root component that manages tooltip state.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger - The element that triggers the tooltip on hover/focus.
 * Use `asChild` to render as the child element.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent - The tooltip content that appears on hover/focus.
 *
 * @figma Obra/Tooltip - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=274-57607
 *
 * @example
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <Button>Hover me</Button>
 *     </TooltipTrigger>
 *     <TooltipContent>
 *       Tooltip text
 *     </TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 *
 * @example
 * // With different sides
 * <TooltipContent side="bottom">Below</TooltipContent>
 * <TooltipContent side="left">Left</TooltipContent>
 * <TooltipContent side="right">Right</TooltipContent>
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      side = 'top',
      align = 'center',
      sideOffset = 4,
      showArrow = true,
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-lg bg-popover px-2 py-1.5',
        'text-xs text-popover-foreground',
        'animate-in fade-in-0 zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <TooltipPrimitive.Arrow className="fill-popover" />
      )}
    </TooltipPrimitive.Content>
  )
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
