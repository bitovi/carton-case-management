import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  open,
  onOpenChange,
  variant = 'success',
  title,
  message,
  icon,
  autoHideDuration = 10000,
}: ToastProps) {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    if (open && autoHideDuration > 0) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-dismiss
      timeoutRef.current = setTimeout(() => {
        onOpenChange(false);
      }, autoHideDuration);
    }

    // Cleanup on unmount or when open changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, autoHideDuration, onOpenChange]);

  const handleDismiss = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onOpenChange(false);
  };

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg'
          )}
        >
          {icon && (
            <div className="flex justify-center">
              <div className="text-4xl">{icon}</div>
            </div>
          )}

          <div className="text-center space-y-2">
            <AlertDialogPrimitive.Title className="text-lg font-bold text-gray-900">
              {title}
            </AlertDialogPrimitive.Title>

            <AlertDialogPrimitive.Description className="text-sm text-gray-600">
              {message}
            </AlertDialogPrimitive.Description>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleDismiss} className="px-6">
              Dismiss
            </Button>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
