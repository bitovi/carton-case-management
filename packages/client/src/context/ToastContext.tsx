import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/components/obra/Toast';
import { FolderX } from 'lucide-react';

export interface ToastMessage {
  type?: 'success' | 'neutral' | 'error';
  icon?: ReactNode;
  title: string;
  message: string;
  autoClose?: number;
}

interface ToastContextType {
  showToast: (toast: ToastMessage) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((toast: ToastMessage) => {
    // Replace any existing toast with the new one
    setCurrentToast(toast);
  }, []);

  const hideToast = useCallback(() => {
    setCurrentToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {currentToast && (
        <Toast
          open={true}
          type={currentToast.type}
          icon={currentToast.icon}
          title={currentToast.title}
          message={currentToast.message}
          onClose={hideToast}
          autoClose={currentToast.autoClose}
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

// Helper functions for common toast types
export const toastHelpers = {
  success: (message: string, title = 'Success!', icon: ReactNode = '🎉'): ToastMessage => ({
    type: 'success',
    icon,
    title,
    message,
  }),
  
  caseCreated: (): ToastMessage => ({
    type: 'success',
    icon: '🎉',
    title: 'Success!',
    message: 'A new claim has been created.',
  }),
  
  caseDeleted: (caseName: string): ToastMessage => ({
    type: 'neutral',
    icon: <FolderX size={24} className="text-gray-700" />,
    title: 'Deleted',
    message: `"${caseName}" case has been successfully deleted.`,
  }),
  
  error: (message: string, title = 'Error'): ToastMessage => ({
    type: 'error',
    icon: '⚠️',
    title,
    message,
  }),
};
