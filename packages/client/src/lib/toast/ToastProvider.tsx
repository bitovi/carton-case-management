import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '@/components/obra/Toast';
import type { ToastType } from '@/components/obra/Toast';

interface ToastState {
  type: ToastType;
  title: string;
  message?: string;
  icon?: ReactNode;
  open: boolean;
}

interface ToastContextValue {
  showToast: (params: {
    type: ToastType;
    title: string;
    message?: string;
    icon?: ReactNode;
  }) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    type: 'Neutral',
    title: '',
    open: false,
  });

  const showToast = ({
    type,
    title,
    message,
    icon,
  }: {
    type: ToastType;
    title: string;
    message?: string;
    icon?: ReactNode;
  }) => {
    setToast({
      type,
      title,
      message,
      icon,
      open: true,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        type={toast.type}
        title={toast.title}
        message={toast.message}
        icon={toast.icon}
        open={toast.open}
        onDismiss={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
