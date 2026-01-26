import { ReactNode } from 'react';

export interface DialogFooterProps {
  /**
   * Footer content
   * Typically action buttons (Cancel, Save, etc.)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}
