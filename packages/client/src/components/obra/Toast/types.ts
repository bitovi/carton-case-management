export type ToastType = 'success' | 'error' | 'neutral';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  icon?: React.ReactNode;
  onDismiss: () => void;
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastProps, 'id' | 'onDismiss'>) => void;
  hideToast: () => void;
}
