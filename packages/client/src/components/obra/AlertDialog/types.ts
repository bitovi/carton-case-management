import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

/**
 * Layout variant for AlertDialog content
 * - mobile: Centered text, stacked full-width buttons (action first)
 * - desktop: Left-aligned text, inline right-aligned buttons (cancel first)
 */
export type AlertDialogVariant = 'mobile' | 'desktop';

/**
 * Context for sharing variant across compound components
 */
export interface AlertDialogContextValue {
  variant: AlertDialogVariant;
}

/**
 * Root AlertDialog props - wraps Radix AlertDialog.Root
 */
export type AlertDialogProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Root
>;

/**
 * Trigger props - wraps Radix AlertDialog.Trigger
 */
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;

/**
 * Portal props - wraps Radix AlertDialog.Portal
 */
export type AlertDialogPortalProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Portal
>;

/**
 * Overlay props - wraps Radix AlertDialog.Overlay
 */
export type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Overlay
>;

/**
 * Content props with variant support
 * @figma Type: Mobile | Desktop
 */
export interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  /**
   * Layout variant
   * @default 'desktop'
   * @figma Type
   */
  variant?: AlertDialogVariant;
}

/**
 * Header props - container for title and description
 */
export type AlertDialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Footer props - container for action buttons
 */
export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Title props - wraps Radix AlertDialog.Title
 */
export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>;

/**
 * Description props - wraps Radix AlertDialog.Description
 */
export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

/**
 * Action button props with variant support
 */
export interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: 'default' | 'destructive';
}

/**
 * Cancel button props
 */
export type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Cancel
>;
