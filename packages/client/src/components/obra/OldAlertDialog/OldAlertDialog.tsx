import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import type { OldAlertDialogProps } from './types';

export function OldAlertDialog({
  type = 'mobile',
  title,
  description,
  actionButton,
  cancelButton,
  open,
  onOpenChange,
  children,
}: OldAlertDialogProps) {
  const isMobile = type === 'mobile';

  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children && <AlertDialogPrimitive.Trigger asChild>{children}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-amber-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-4 border-dashed border-amber-500 bg-amber-50 p-6 shadow-2xl shadow-amber-500/50 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg',
            isMobile ? 'max-w-[calc(100vw-2rem)] sm:max-w-xs' : 'max-w-lg'
          )}
        >
          <AlertDialogPrimitive.Title
            className={cn('text-lg font-bold text-amber-900', isMobile ? 'text-center' : 'text-left')}
          >
            {title}
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description
            className={cn('text-sm text-amber-800 font-medium', isMobile ? 'text-center' : 'text-left')}
          >
            {description}
          </AlertDialogPrimitive.Description>

          <div
            className={cn('flex gap-2', isMobile ? 'flex-col' : 'flex-row-reverse justify-start')}
          >
            {actionButton}
            {cancelButton}
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
