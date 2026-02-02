import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'neutral';

export interface ToastProps {
  /**
   * Toast type/variant
   * @default 'neutral'
   */
  type?: ToastType;

  /**
   * Icon element to display
   */
  icon?: ReactNode;

  /**
   * Toast title text
   */
  title?: string;

  /**
   * Toast message/description
   */
  message: string;

  /**
   * Whether the toast is visible
   * @default true
   */
  open?: boolean;

  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss duration in milliseconds (0 to disable)
   * @default 10000
   */
  duration?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastProps, 'open' | 'onDismiss'>) => void;
  hideToast: () => void;
}
