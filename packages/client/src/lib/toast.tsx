import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Toast } from '@/components/obra/Toast';

interface ToastConfig {
  type?: 'Success' | 'Deleted';
  title: string;
  message: string;
  icon?: ReactNode;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastConfig & { open: boolean }) | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showToast = useCallback((config: ToastConfig) => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Replace any existing toast (no stacking)
    setToast({ ...config, open: true });

    // Auto-dismiss after 10 seconds
    const newTimeoutId = window.setTimeout(() => {
      setToast(null);
      setTimeoutId(null);
    }, 10000);

    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          icon={toast.icon}
          open={toast.open}
          onDismiss={hideToast}
        />
      )}
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
