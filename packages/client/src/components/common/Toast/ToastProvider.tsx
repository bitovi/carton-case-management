import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { FolderX } from 'lucide-react';
import { Toast } from './Toast';
import type { ToastContextValue } from './types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastState {
  open: boolean;
  icon?: ReactNode;
  title: string;
  description: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: '',
    description: '',
  });

  const dismiss = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToast({
      open: true,
      icon: <span>🎉</span>,
      title: 'Success!',
      description: message,
    });
  }, []);

  const showDeleted = useCallback((caseName: string) => {
    setToast({
      open: true,
      icon: <FolderX className="h-10 w-10 text-gray-700" />,
      title: 'Deleted',
      description: `"${caseName}" case has been successfully deleted.`,
    });
  }, []);

  const value: ToastContextValue = {
    showSuccess,
    showDeleted,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        open={toast.open}
        onClose={dismiss}
        icon={toast.icon}
        title={toast.title}
        description={toast.description}
      />
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
