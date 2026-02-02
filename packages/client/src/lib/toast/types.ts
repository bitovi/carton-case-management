import { ReactNode } from 'react';
import { ToastVariant } from '@/components/common/Toast';

export interface ToastOptions {
  /**
   * Toast variant controlling icon and styling
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
   * Duration in milliseconds before auto-dismiss
   * @default 10000
   */
  duration?: number;

  /**
   * Whether to auto-dismiss after duration
   * @default true
   */
  autoDismiss?: boolean;

  /**
   * Optional custom icon to override variant icon
   */
  icon?: ReactNode;
}

export interface ToastContextValue {
  /**
   * Show a toast notification
   */
  showToast: (options: ToastOptions) => void;

  /**
   * Hide the currently visible toast
   */
  hideToast: () => void;
}
