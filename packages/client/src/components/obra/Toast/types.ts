import { ReactNode } from 'react';

export type ToastType = 'Success' | 'Neutral' | 'Error';

export interface ToastProps {
  /**
   * Toast type
   * @default 'Neutral'
   */
  type?: ToastType;

  /**
   * Primary toast text (title/status)
   */
  title: string;

  /**
   * Secondary message text
   */
  message?: string;

  /**
   * Icon element to display
   */
  icon?: ReactNode;

  /**
   * Whether the toast is currently visible
   * @default false
   */
  open?: boolean;

  /**
   * Callback when dismiss button is clicked or auto-dismiss triggers
   */
  onDismiss?: () => void;

  /**
   * Auto-dismiss duration in milliseconds
   * @default 10000 (10 seconds)
   * Set to 0 to disable auto-dismiss
   */
  duration?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}
