import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import { X, FolderX } from 'lucide-react';
import type { ToastProps } from './types';

const VARIANT_STYLES = {
  success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
  error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
  neutral: 'border-border bg-background',
};

const VARIANT_ICONS = {
  success: '🎉',
  error: <FolderX className="h-6 w-6 text-red-600 dark:text-red-400" />,
  neutral: null,
};

const VARIANT_TITLE_STYLES = {
  success: 'text-green-900 dark:text-green-100',
  error: 'text-red-900 dark:text-red-100',
  neutral: 'text-foreground',
};

const VARIANT_MESSAGE_STYLES = {
  success: 'text-green-700 dark:text-green-300',
  error: 'text-red-700 dark:text-red-300',
  neutral: 'text-muted-foreground',
};

export function Toast({
  variant = 'neutral',
  title,
  message,
  open,
  onDismiss,
  autoDismiss = true,
  duration = 10000,
  icon,
}: ToastProps) {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  // Auto-dismiss timer
  React.useEffect(() => {
    if (open && autoDismiss) {
      timeoutRef.current = setTimeout(() => {
        onDismiss();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, autoDismiss, duration, onDismiss]);

  // Handle escape key
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onDismiss]);

  if (!open) return null;

  const displayIcon = icon !== undefined ? icon : VARIANT_ICONS[variant];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state={open ? 'open' : 'closed'}
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Toast content */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={cn(
          'fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg',
          VARIANT_STYLES[variant]
        )}
        data-state={open ? 'open' : 'closed'}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          {displayIcon && (
            <div className="flex-shrink-0" aria-hidden="true">
              {typeof displayIcon === 'string' ? (
                <span className="text-2xl" role="img" aria-label={variant}>
                  {displayIcon}
                </span>
              ) : (
                displayIcon
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 space-y-1">
            <h3 className={cn('text-lg font-semibold', VARIANT_TITLE_STYLES[variant])}>
              {title}
            </h3>
            <p className={cn('text-sm', VARIANT_MESSAGE_STYLES[variant])}>{message}</p>
          </div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:hover:bg-white/10',
              variant === 'success' && 'focus-visible:ring-green-600',
              variant === 'error' && 'focus-visible:ring-red-600',
              variant === 'neutral' && 'focus-visible:ring-primary'
            )}
            aria-label="Dismiss notification"
          >
            <X
              className={cn(
                'h-5 w-5',
                variant === 'success' && 'text-green-600 dark:text-green-400',
                variant === 'error' && 'text-red-600 dark:text-red-400',
                variant === 'neutral' && 'text-muted-foreground'
              )}
            />
          </button>
        </div>

        {/* Dismiss button */}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="small" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
    </>
  );
}
