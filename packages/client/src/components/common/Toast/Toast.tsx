import { useEffect } from 'react';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  open,
  onClose,
  icon,
  title,
  description,
  autoHideDuration = 10000,
}: ToastProps) {
  useEffect(() => {
    if (open && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Toast Modal */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
          <div className="flex flex-col items-center text-center gap-3">
            {/* Icon */}
            {icon && (
              <div className="flex items-center justify-center text-4xl">
                {icon}
              </div>
            )}

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>

            {/* Description */}
            <p className="text-sm text-gray-700">{description}</p>

            {/* Dismiss Button */}
            <Button
              variant="outline"
              onClick={onClose}
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
