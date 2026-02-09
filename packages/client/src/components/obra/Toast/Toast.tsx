import * as ToastPrimitive from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';
import type { ToastProps } from './types';
import { X } from 'lucide-react';

export function Toast({
  type = 'success',
  title,
  description,
  emoji,
  open,
  onOpenChange,
  duration = 5000,
  className,
}: ToastProps) {
  const typeStyles = {
    success: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
    error: {
      container: 'bg-card border-destructive',
      title: 'text-destructive',
      description: 'text-muted-foreground',
    },
  };

  const styles = typeStyles[type];

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        'group pointer-events-auto relative flex w-full max-w-md items-start gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
        'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full',
        'data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-full',
        styles.container,
        className
      )}
    >
      <div className="flex flex-1 items-start gap-3">
        {emoji && (
          <span className="shrink-0 text-2xl leading-none" aria-hidden="true">
            {emoji}
          </span>
        )}

        <div className="flex flex-1 flex-col gap-1">
          <ToastPrimitive.Title
            className={cn('text-base font-semibold leading-6', styles.title)}
          >
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description
              className={cn('text-sm font-normal leading-5', styles.description)}
            >
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
      </div>

      <ToastPrimitive.Close
        className={cn(
          'shrink-0 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity',
          'hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2',
          'group-hover:opacity-100'
        )}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}
