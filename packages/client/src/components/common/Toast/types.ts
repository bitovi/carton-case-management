import { ReactNode } from 'react';

export type ToastVariant = 'success' | 'error' | 'neutral';

export interface ToastProps {
  /**
   * Toast variant controlling icon, styling
   * @default 'neutral'
   */
  variant?: ToastVariant;

  /**
   * Toast title text
   */
  title: string;

  /**
   * Toast message content
   */
  message: string;

  /**
   * Whether the toast is visible
   */
  open: boolean;

  /**
   * Callback when toast should be dismissed
   */
  onDismiss: () => void;

  /**
   * Whether to auto-dismiss after duration
   * @default true
   */
  autoDismiss?: boolean;

  /**
   * Duration in milliseconds before auto-dismiss
   * @default 10000
   */
  duration?: number;

  /**
   * Optional custom icon to override variant icon
   */
  icon?: ReactNode;
}
