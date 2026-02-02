import * as React from 'react';
import { Toast } from '@/components/common/Toast';
import type { ToastOptions, ToastContextValue } from './types';

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

interface ToastState extends ToastOptions {
  id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastState | null>(null);

  const showToast = React.useCallback((options: ToastOptions) => {
    const id = crypto.randomUUID();
    setToast({ ...options, id });
  }, []);

  const hideToast = React.useCallback(() => {
    setToast(null);
  }, []);

  const value = React.useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          open={true}
          onDismiss={hideToast}
          duration={toast.duration}
          autoDismiss={toast.autoDismiss}
          icon={toast.icon}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
