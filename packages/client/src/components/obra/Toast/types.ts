import { ReactNode } from 'react';

export type ToastType = 'success' | 'deleted';

export interface ToastProps {
  /**
   * Unique identifier for the toast
   */
  id: string;
  
  /**
   * Toast type - determines icon and styling
   * @default 'success'
   */
  type?: ToastType;
  
  /**
   * Toast title
   */
  title: string;
  
  /**
   * Toast message/description
   */
  message: string;
  
  /**
   * Custom icon override
   */
  icon?: ReactNode;
  
  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface ToastConfig {
  /**
   * Toast type
   */
  type?: ToastType;
  
  /**
   * Toast title
   */
  title: string;
  
  /**
   * Toast message
   */
  message: string;
  
  /**
   * Duration in milliseconds before auto-dismiss
   * @default 4000
   */
  duration?: number;
}

export interface ToastContextValue {
  /**
   * Show a toast notification
   */
  toast: (config: ToastConfig) => void;
  
  /**
   * Show a success toast
   */
  success: (title: string, message: string) => void;
  
  /**
   * Show a deleted toast
   */
  deleted: (title: string, message: string) => void;
  
  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (id: string) => void;
  
  /**
   * Dismiss all toasts
   */
  dismissAll: () => void;
}
