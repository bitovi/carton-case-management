import type { ReactNode } from 'react';

export interface DialogProps {
  /**
   * Type of dialog layout
   * @default 'Desktop'
   * @figma Variant: Type
   */
  type?: 'Desktop' | 'Desktop Scrollable' | 'Mobile' | 'Mobile Full Screen Scrollable';
  
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
   * Callback when close button is clicked
   */
  onClose?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
