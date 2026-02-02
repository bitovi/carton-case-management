import { useEffect } from 'react';
import { X, FolderX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../Button';
import type { ToastProps } from './types';

const CELEBRATION_EMOJI = '🎉';

export function Toast({
  variant = 'neutral',
  title,
  message,
  icon,
  open = false,
  onDismiss,
  autoHideDuration = 10000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (open && autoHideDuration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onDismiss]);

  if (!open) return null;

  // Determine icon if not provided
  const defaultIcon = variant === 'success' ? CELEBRATION_EMOJI : variant === 'error' ? <FolderX className="h-6 w-6" /> : null;
  const displayIcon = icon ?? defaultIcon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state={open ? 'open' : 'closed'}
        onClick={onDismiss}
      />

      {/* Toast Modal */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-full max-w-md',
          'rounded-lg border bg-background p-6 shadow-lg',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        data-state={open ? 'open' : 'closed'}
        role="alertdialog"
        aria-labelledby="toast-title"
        aria-describedby={message ? 'toast-message' : undefined}
      >
        {/* Content Container */}
        <div className="flex flex-col items-center text-center gap-4">
          {/* Icon */}
          {displayIcon && (
            <div className="flex items-center justify-center">
              {typeof displayIcon === 'string' ? (
                <span className="text-4xl" role="img" aria-label="celebration">
                  {displayIcon}
                </span>
              ) : (
                displayIcon
              )}
            </div>
          )}

          {/* Title */}
          <h2
            id="toast-title"
            className={cn(
              'text-lg font-bold',
              variant === 'error' ? 'text-foreground' : 'text-foreground'
            )}
          >
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p id="toast-message" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}

          {/* Dismiss Button */}
          <Button
            variant="outline"
            onClick={onDismiss}
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </>
  );
}
