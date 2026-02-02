import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../Button';
import type { ToastProps } from './types';

export function Toast({
  type = 'success',
  icon,
  title,
  message,
  open = false,
  onClose,
  autoClose = 10000,
}: ToastProps) {
  useEffect(() => {
    if (open && autoClose > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [open, autoClose, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Toast modal */}
      <div
        role="alert"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-[calc(100vw-2rem)] max-w-md',
          'rounded-lg bg-white p-6 shadow-lg',
          'flex flex-col gap-4'
        )}
      >
        {/* Icon and Title */}
        <div className="flex items-start gap-3">
          {icon && <div className="flex-shrink-0 text-2xl">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600">{message}</p>

        {/* Dismiss Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="regular" onClick={onClose}>
            Dismiss
          </Button>
        </div>
      </div>
    </>
  );
}
