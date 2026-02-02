import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  type = 'Neutral',
  title,
  message,
  icon,
  open = false,
  onDismiss,
  duration = 10000,
  className,
}: ToastProps) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (open && duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onDismiss]);

  if (!open) return null;

  const typeStyles = {
    Success: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      message: 'text-muted-foreground',
      icon: 'text-foreground',
    },
    Neutral: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      message: 'text-muted-foreground',
      icon: 'text-foreground',
    },
    Error: {
      container: 'bg-card border-border',
      title: 'text-destructive-foreground',
      message: 'text-destructive-foreground',
      icon: 'text-destructive-foreground',
    },
  };

  const styles = typeStyles[type];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Toast Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
      >
        <div
          className={cn(
            'pointer-events-auto flex flex-col gap-4 rounded-lg border p-6 shadow-lg w-full max-w-md mx-4',
            styles.container,
            className
          )}
        >
          <div className="flex items-start gap-3">
            {icon && (
              <div className={cn('flex shrink-0 items-center', styles.icon)}>
                {icon}
              </div>
            )}

            <div className="flex flex-1 flex-col gap-1">
              <h3 className={cn('text-lg font-bold leading-[27px]', styles.title)}>
                {title}
              </h3>
              {message && (
                <p className={cn('text-sm font-normal leading-[21px] tracking-[0.07px]', styles.message)}>
                  {message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="regular"
              onClick={onDismiss}
              className="text-sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
