import type { ReactNode } from 'react';

export interface DialogProps {
  /**
   * Whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when dialog state should change
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Type of dialog layout
   * @default 'Desktop'
   * @figma Variant: Type
   */
  type?: 'Desktop' | 'Desktop Scrollable' | 'Mobile' | 'Mobile Full Screen Scrollable';
  
  /**
   * The dialog's accessible name, announced by screen readers when it opens.
   *
   * Rendered visually hidden, so pass the same wording as the visible heading. Radix requires
   * every dialog to have one - without it screen reader users hear an unnamed dialog, and Radix
   * logs "`DialogContent` requires a `DialogTitle`". The default is only a fallback; always pass
   * something specific.
   *
   * @default 'Dialog'
   */
  title?: string;

  /**
   * Optional accessible description, announced after the title. Also visually hidden.
   *
   * Leave it unset when the dialog needs no extra explanation - the component then opts out of
   * Radix's description warning rather than inventing text.
   */
  description?: string;

  /**
   * Dialog content
   */
  children: ReactNode;
  
  /**
   * Dialog header (for scrollable variants)
   * Typically a DialogHeader component instance
   * @figma Instance: DialogHeader
   */
  header?: ReactNode;
  
  /**
   * Dialog footer (for scrollable variants)
   * Typically a DialogFooter component instance
   * @figma Instance: DialogFooter
   */
  footer?: ReactNode;
  
  /**
   * Callback when close button is clicked (legacy, prefer onOpenChange)
   * @deprecated Use onOpenChange instead
   */
  onClose?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
