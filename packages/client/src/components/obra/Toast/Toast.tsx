import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({ 
  type = 'Neutral',
  title,
  message,
  icon,
  open,
  onClose,
  className,
}: ToastProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  const typeStyles = {
    Success: {
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
    Neutral: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      message: 'text-muted-foreground',
      icon: 'text-foreground',
    },
  };

  const styles = typeStyles[type];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div 
          className={cn(
            'pointer-events-auto w-full max-w-md mx-4',
            'flex flex-col gap-4 rounded-lg border p-6 shadow-lg',
            styles.container,
            className
          )}
          role="alertdialog"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="flex items-start gap-4">
            {icon && (
              <div className={cn('flex shrink-0 items-center text-2xl', styles.icon)}>
                {icon}
              </div>
            )}
            
            <div className="flex flex-1 flex-col gap-1">
              <p className={cn('text-base font-bold leading-6', styles.title)}>
                {title}
              </p>
              {message && (
                <p className={cn('text-sm font-normal leading-[21px]', styles.message)}>
                  {message}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="regular"
              onClick={onClose}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
