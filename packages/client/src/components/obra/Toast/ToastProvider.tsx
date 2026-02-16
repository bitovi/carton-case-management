import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { ToastConfig, ToastContextValue } from './types';
import type { ToastProps } from './types';
import { Toast } from './Toast';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastItem extends Omit<ToastProps, 'onDismiss'> {
  duration: number;
}

let toastCounter = 0;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const location = useLocation();
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clear all toasts on navigation
  useEffect(() => {
    setToasts([]);
    // Clear all timeouts when navigating
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, [location.pathname]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    // Clear the timeout for this toast
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  const toast = useCallback((config: ToastConfig) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    const duration = config.duration ?? 4000;
    
    const newToast: ToastItem = {
      id,
      type: config.type ?? 'success',
      title: config.title,
      message: config.message,
      duration,
    };

    setToasts((prev) => [newToast, ...prev]); // Add new toast at the beginning (top of stack)

    // Auto-dismiss after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        dismiss(id);
      }, duration);
      timeoutsRef.current.set(id, timeout);
    }
  }, [dismiss]);

  const success = useCallback(
    (title: string, message: string) => {
      toast({ type: 'success', title, message });
    },
    [toast]
  );

  const deleted = useCallback(
    (title: string, message: string) => {
      toast({ type: 'deleted', title, message });
    },
    [toast]
  );

  const value: ToastContextValue = {
    toast,
    success,
    deleted,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toaster component that renders all active toasts
interface ToasterProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function Toaster({ toasts, onDismiss }: ToasterProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none sm:bottom-4 sm:items-center"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex w-full flex-col gap-2 sm:max-w-md pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
