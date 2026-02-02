import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Toast } from '@/components/obra/Toast';

// Auto-dismiss duration for toast notifications (in milliseconds)
const TOAST_AUTO_DISMISS_DURATION = 10000;

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
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  const showToast = useCallback((config: ToastConfig) => {
    // Clear any existing timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // Replace any existing toast (no stacking)
    setToast({ ...config, open: true });

    // Auto-dismiss after 10 seconds
    timeoutIdRef.current = setTimeout(() => {
      setToast(null);
      timeoutIdRef.current = null;
    }, TOAST_AUTO_DISMISS_DURATION);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

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
