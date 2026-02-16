import * as React from 'react';
import type { UseToastOptions } from './types';

interface ToastState extends UseToastOptions {
  id: string;
  open: boolean;
}

interface ToastContextValue {
  toasts: ToastState[];
  addToast: (options: UseToastOptions) => string;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastContextProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = React.useCallback((options: UseToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id, open: true }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }

  return {
    toasts: context.toasts,
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}
