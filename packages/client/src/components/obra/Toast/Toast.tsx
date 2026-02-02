import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  type = 'neutral',
  icon,
  title,
  message,
  open = true,
  onDismiss,
  duration = 10000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (open && duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onDismiss]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onDismiss) {
        onDismiss();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open, onDismiss]);

  if (!open) return null;

  const typeStyles = {
    success: {
      container: 'bg-white border-gray-200',
      title: 'text-gray-900',
      message: 'text-gray-700',
    },
    error: {
      container: 'bg-white border-red-200',
      title: 'text-red-900',
      message: 'text-red-700',
    },
    neutral: {
      container: 'bg-white border-gray-200',
      title: 'text-gray-900',
      message: 'text-gray-700',
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'toast-title' : undefined}
      aria-describedby="toast-message"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Toast Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col gap-4 rounded-lg border-2 bg-white p-6 shadow-lg',
          'min-w-[320px] max-w-[480px]',
          styles.container,
          className
        )}
      >
        {/* Icon and Text */}
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 text-3xl" aria-hidden="true">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3
                id="toast-title"
                className={cn('text-lg font-bold mb-1', styles.title)}
              >
                {title}
              </h3>
            )}
            <p
              id="toast-message"
              className={cn('text-sm leading-relaxed', styles.message)}
            >
              {message}
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="flex justify-end">
          <Button
            onClick={onDismiss}
            variant="outline"
            size="small"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}
