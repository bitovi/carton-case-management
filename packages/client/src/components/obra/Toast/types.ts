export type ToastVariant = 'success' | 'neutral' | 'error';

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ToastVariant;
  title: string;
  message: string;
  icon?: React.ReactNode;
  autoHideDuration?: number; // in milliseconds, default 10000 (10 seconds)
}
