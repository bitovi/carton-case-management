import { ReactNode } from "react";

export type ToastType = 'Success' | 'Error' | 'Neutral';

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
   * Optional secondary text (message)
   */
  message?: string;
  
  /**
   * Icon element to display
   */
  icon?: ReactNode;
  
  /**
   * Whether the toast is open
   */
  open: boolean;
  
  /**
   * Callback when toast should be closed
   */
  onClose: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
