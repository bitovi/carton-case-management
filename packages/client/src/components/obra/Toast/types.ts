import { ReactNode } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  emoji?: string;
  duration?: number;
}

export interface ToastProps {
  /**
   * Toast type - determines styling
   * @default 'success'
   */
  type?: ToastType;

  /**
   * Toast title/heading
   */
  title: string;

  /**
   * Optional toast description
   */
  description?: string;

  /**
   * Optional emoji to display
   */
  emoji?: string;

  /**
   * Whether the toast is open
   */
  open?: boolean;

  /**
   * Callback when toast open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Auto-dismiss duration in milliseconds
   * @default 5000
   */
  duration?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  hideToast: (id: string) => void;
}
