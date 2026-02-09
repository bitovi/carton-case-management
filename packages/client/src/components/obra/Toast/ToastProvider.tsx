import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Toast } from './Toast';
import type { ToastData, ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <ToastPrimitive.Provider swipeDirection="down">
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            description={toast.description}
            emoji={toast.emoji}
            duration={toast.duration}
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                hideToast(toast.id);
              }
            }}
          />
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-0 left-1/2 z-[100] flex max-h-screen w-full max-w-md -translate-x-1/2 flex-col-reverse gap-2 p-4 sm:bottom-4 sm:flex-col md:max-w-[420px]" />
      </ToastPrimitive.Provider>
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
