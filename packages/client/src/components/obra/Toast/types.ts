import { ReactNode } from 'react';

export type ToastType = 'success' | 'neutral' | 'error';

export interface ToastProps {
  /**
   * Type of toast message
   * @default 'success'
   */
  type?: ToastType;

  /**
   * Icon to display in the toast
   */
  icon?: ReactNode;

  /**
   * Title text for the toast
   */
  title: string;

  /**
   * Message text for the toast
   */
  message: string;

  /**
   * Whether the toast is visible
   */
  open?: boolean;

  /**
   * Callback when toast should be closed
   */
  onClose?: () => void;

  /**
   * Auto-dismiss timeout in milliseconds
   * Set to 0 to disable auto-dismiss
   * @default 10000 (10 seconds)
   */
  autoClose?: number;
}
