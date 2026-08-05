import { ReactNode } from 'react';

export interface SheetProps {
  /**
   * Controls sheet visibility
   * @default false
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Whether content area is scrollable
   * @default true
   * @figma Variant: Scrollable
   */
  scrollable?: boolean;

  /**
   * The sheet's accessible name, announced by screen readers when it opens.
   *
   * Rendered visually hidden, so pass the same wording as the visible heading. A Sheet is a Radix
   * dialog underneath, and Radix requires every dialog to have a name. The default is only a
   * fallback; always pass something specific.
   *
   * @default 'Sheet'
   */
  title?: string;

  /**
   * Optional accessible description, announced after the title. Also visually hidden.
   */
  description?: string;

  /**
   * Header slot content
   * Typically a DialogHeader component
   * @figma Instance: DialogHeader
   */
  header?: ReactNode;

  /**
   * Main content area
   * @figma Content slot
   */
  children: ReactNode;

  /**
   * Footer slot content
   * Typically a DialogFooter component with action buttons
   * @figma Footer area
   */
  footer?: ReactNode;

  /**
   * Additional CSS classes for the sheet panel
   */
  className?: string;
}
