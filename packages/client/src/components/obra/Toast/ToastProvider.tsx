import * as React from 'react';
import { Toast } from './Toast';
import type { ToastProps, ToastContextValue } from './types';

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = React.useState<Omit<ToastProps, 'onDismiss'> | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const hideToast = React.useCallback(() => {
    setToast(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showToast = React.useCallback(
    (newToast: Omit<ToastProps, 'id' | 'onDismiss'>) => {
      // Clear existing timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create new toast with unique ID
      const id = `toast-${Date.now()}`;
      setToast({ ...newToast, id });

      // Auto-dismiss after 10 seconds
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, 10000);
    },
    [hideToast]
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          icon={toast.icon}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
