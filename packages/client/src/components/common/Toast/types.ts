import { ReactNode } from 'react';

export interface ToastProps {
  /**
   * Whether the toast is currently visible
   */
  open: boolean;

  /**
   * Callback when the toast should be closed
   */
  onClose: () => void;

  /**
   * Icon to display in the toast
   */
  icon?: ReactNode;

  /**
   * Title text for the toast
   */
  title: string;

  /**
   * Description/message text for the toast
   */
  description: string;

  /**
   * Auto-dismiss timeout in milliseconds
   * @default 10000 (10 seconds)
   */
  autoHideDuration?: number;
}

export interface ToastContextValue {
  /**
   * Show a success toast
   */
  showSuccess: (message: string) => void;

  /**
   * Show a deleted toast with case name
   */
  showDeleted: (caseName: string) => void;

  /**
   * Dismiss the current toast
   */
  dismiss: () => void;
}
