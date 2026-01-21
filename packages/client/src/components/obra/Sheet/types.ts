import * as React from 'react';

/**
 * Side from which sheet slides in
 */
export type SheetSide = 'left' | 'right' | 'top' | 'bottom';

/**
 * Sheet component props
 * @figma Obra/Sheet - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=301-243233
 */
export interface SheetProps {
  /**
   * Whether the sheet is open
   */
  open: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Content to render inside the sheet
   * @figma Slot content area
   */
  children: React.ReactNode;

  /**
   * Whether content area is scrollable with close button and footer
   * @default true
   * @figma Variant: Scrollable (True | False)
   */
  scrollable?: boolean;

  /**
   * Side from which sheet appears
   * @default 'right'
   */
  side?: SheetSide;

  /**
   * Label for cancel/secondary button (only shown when scrollable=true)
   * @default 'Cancel'
   * @figma Footer cancel button label
   */
  cancelLabel?: string;

  /**
   * Label for primary action button (only shown when scrollable=true)
   * @default 'Submit'
   * @figma Footer action button label
   */
  actionLabel?: string;

  /**
   * Callback when cancel button clicked
   */
  onCancel?: () => void;

  /**
   * Callback when action button clicked
   */
  onAction?: () => void;

  /**
   * Additional CSS classes for the sheet container
   */
  className?: string;
}
