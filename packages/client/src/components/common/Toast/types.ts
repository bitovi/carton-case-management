import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'deleted';

export interface ToastProps {
  /**
   * Toast type
   * @default 'success'
   */
  type?: ToastType;
  
  /**
   * Toast heading/title
   */
  title: string;
  
  /**
   * Toast message/description
   */
  message: string;
  
  /**
   * Whether to show the dismiss button
   * @default true
   */
  showDismiss?: boolean;
  
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

export interface ToastItem extends Omit<ToastProps, 'onDismiss'> {
  id: string;
  type: ToastType;
}
