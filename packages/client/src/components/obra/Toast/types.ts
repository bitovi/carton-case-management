import { ReactNode } from 'react';

export type ToastVariant = 'success' | 'neutral' | 'error';

export interface ToastProps {
  /**
   * Visual variant of the toast
   * @default 'neutral'
   */
  variant?: ToastVariant;

  /**
   * Title text displayed in the toast
   */
  title: string;

  /**
   * Message/description text displayed in the toast
   */
  message?: string;

  /**
   * Icon to display in the toast
   */
  icon?: ReactNode;

  /**
   * Whether the toast is visible
   * @default false
   */
  open?: boolean;

  /**
   * Callback when the dismiss button is clicked or toast auto-dismisses
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss timeout in milliseconds
   * @default 10000 (10 seconds)
   */
  autoHideDuration?: number;

  /**
   * Custom className for the toast container
   */
  className?: string;
}
