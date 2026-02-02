import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from './Toast';
import type { ToastProps, ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(Omit<ToastProps, 'open' | 'onDismiss'> & { id: number }) | null>(null);
  const [toastId, setToastId] = useState(0);

  const showToast = (newToast: Omit<ToastProps, 'open' | 'onDismiss'>) => {
    const id = toastId + 1;
    setToastId(id);
    setToast({ ...newToast, id });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          {...toast}
          open={true}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
