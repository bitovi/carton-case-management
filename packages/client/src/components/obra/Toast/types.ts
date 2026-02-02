import { type ReactNode } from 'react';

export interface ToastProps {
  /**
   * Toast type - determines styling and default icon
   * @default 'Success'
   */
  type?: 'Success' | 'Deleted';
  
  /**
   * Title text displayed at top of toast
   */
  title: string;
  
  /**
   * Message text displayed below title
   */
  message: string;
  
  /**
   * Optional custom icon to override default
   */
  icon?: ReactNode;
  
  /**
   * Callback when dismiss button is clicked
   */
  onDismiss?: () => void;
  
  /**
   * Whether the toast is currently open
   * @default true
   */
  open?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
