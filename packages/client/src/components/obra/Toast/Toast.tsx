import * as React from 'react';
import { X, CheckCircle, XCircle, FolderX } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '@/lib/utils';
import type { ToastProps } from './types';

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, type, title, message, icon, onDismiss }, ref) => {
    const getDefaultIcon = () => {
      switch (type) {
        case 'success':
          return <span className="text-4xl">🎉</span>;
        case 'error':
          return <XCircle className="h-8 w-8 text-red-600" />;
        case 'neutral':
          return <FolderX className="h-8 w-8 text-gray-700" />;
        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        id={id}
        role="alert"
        aria-live="polite"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) {
            onDismiss();
          }
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Toast Card */}
        <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div className="flex items-center justify-center">
            {icon || getDefaultIcon()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600">
            {message}
          </p>

          {/* Dismiss Button */}
          <Button
            variant="outline"
            size="regular"
            onClick={onDismiss}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Dismiss
          </Button>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';
