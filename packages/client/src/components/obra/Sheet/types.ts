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
