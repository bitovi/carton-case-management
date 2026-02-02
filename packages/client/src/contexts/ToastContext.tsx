import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast, type ToastType } from '@/components/obra/Toast';

interface ToastConfig {
  type?: ToastType;
  title: string;
  message?: string;
  icon?: ReactNode;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = useCallback((config: ToastConfig) => {
    setToastConfig(config);
    setIsOpen(true);
  }, []);

  const closeToast = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toastConfig && (
        <Toast
          type={toastConfig.type}
          title={toastConfig.title}
          message={toastConfig.message}
          icon={toastConfig.icon}
          open={isOpen}
          onClose={closeToast}
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
