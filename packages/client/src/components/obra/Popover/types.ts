import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

/**
 * Root popover props
 */
export type PopoverProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Root
>;

/**
 * Trigger props
 */
export type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
>;

/**
 * Anchor props
 */
export type PopoverAnchorProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Anchor
>;

/**
 * Content props with positioning options
 */
export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /**
   * The preferred alignment against the trigger
   * @default 'center'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Distance in pixels from the trigger
   * @default 4
   */
  sideOffset?: number;
}

/**
 * Close button props
 */
export type PopoverCloseProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Close
>;
