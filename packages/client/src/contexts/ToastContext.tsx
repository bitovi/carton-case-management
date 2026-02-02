import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/components/obra/Toast';
import type { ToastVariant } from '@/components/obra/Toast';

interface ToastData {
  variant?: ToastVariant;
  title: string;
  message?: string;
  icon?: ReactNode;
  autoHideDuration?: number;
}

interface ToastContextValue {
  showToast: (data: ToastData) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastData, setToastData] = useState<ToastData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = useCallback((data: ToastData) => {
    // If a toast is already showing, hide it first, then show the new one
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        setToastData(data);
        setIsOpen(true);
      }, 300); // Wait for close animation
    } else {
      setToastData(data);
      setIsOpen(true);
    }
  }, [isOpen]);

  const hideToast = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastData && (
        <Toast
          variant={toastData.variant}
          title={toastData.title}
          message={toastData.message}
          icon={toastData.icon}
          open={isOpen}
          onDismiss={hideToast}
          autoHideDuration={toastData.autoHideDuration}
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
