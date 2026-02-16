import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastProps } from './types';
import { Button } from '../Button';

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ variant = 'success', title, description, icon, open, onOpenChange, duration = 4000, className }, ref) => {
  const variantStyles = {
    success: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
    destructive: {
      container: 'bg-card border-border',
      title: 'text-destructive-foreground',
      description: 'text-destructive-foreground',
    },
  };

  const styles = variantStyles[variant];

  return (
    <ToastPrimitives.Root
      ref={ref}
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all',
        'data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out',
        'data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full',
        'data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-bottom-full',
        styles.container,
        className
      )}
    >
      <div className="flex flex-1 items-start gap-3">
        {icon && (
          <div className="flex shrink-0 items-center pt-0.5">
            {icon}
          </div>
        )}
        
        <div className="flex flex-1 flex-col gap-1">
          <ToastPrimitives.Title
            className={cn('text-sm font-semibold leading-[21px]', styles.title)}
          >
            {title}
          </ToastPrimitives.Title>
          <ToastPrimitives.Description
            className={cn('text-sm font-normal leading-[21px]', styles.description)}
          >
            {description}
          </ToastPrimitives.Description>
        </div>
      </div>
      
      <ToastPrimitives.Close asChild>
        <Button
          variant="outline"
          size="small"
          className="shrink-0"
        >
          Dismiss
        </Button>
      </ToastPrimitives.Close>
      
      <ToastPrimitives.Close
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 sm:hidden"
      >
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});

Toast.displayName = 'Toast';
