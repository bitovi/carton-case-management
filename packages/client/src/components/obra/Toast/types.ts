import { ReactNode } from 'react';

export interface ToastProps {
  /**
   * Toast variant type
   * @default 'success'
   */
  variant?: 'success' | 'destructive';
  
  /**
   * Toast title
   */
  title: string;
  
  /**
   * Toast description/message
   */
  description: string;
  
  /**
   * Icon element to display
   */
  icon?: ReactNode;
  
  /**
   * Whether the toast is open
   */
  open?: boolean;
  
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * @default 4000
   */
  duration?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export interface ToastProviderProps {
  /**
   * Children to wrap with toast provider
   */
  children: ReactNode;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * @default 4000
   */
  duration?: number;
  
  /**
   * Swipe direction on mobile
   * @default 'down'
   */
  swipeDirection?: 'up' | 'down' | 'left' | 'right';
}

export interface UseToastOptions {
  /**
   * Toast variant type
   */
  variant?: 'success' | 'destructive';
  
  /**
   * Toast title
   */
  title: string;
  
  /**
   * Toast description/message
   */
  description: string;
  
  /**
   * Icon element to display
   */
  icon?: ReactNode;
  
  /**
   * Duration in milliseconds before auto-dismissing
   * @default 4000
   */
  duration?: number;
}
