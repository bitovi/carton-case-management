import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DialogProps } from './types';

export function Dialog({
  open,
  onOpenChange,
  type = 'Desktop',
  children,
  header,
  footer,
  onClose,
  className,
}: DialogProps) {
  const isScrollable = type === 'Desktop Scrollable' || type === 'Mobile Full Screen Scrollable';

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className={cn(
            'fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-background flex flex-col shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            {
              'h-[640px] w-[320px]': type === 'Mobile Full Screen Scrollable',
              'border border-border h-[240px] overflow-clip rounded-[10px] w-[320px]': type === 'Mobile',
              'border border-border h-[480px] overflow-clip rounded-xl w-[640px]': type === 'Desktop Scrollable',
              'border border-border h-[480px] overflow-clip rounded-[10px] w-[640px]': type === 'Desktop',
            },
            className
          )}
        >
          {isScrollable && header && (
            <div className="flex flex-col h-[52px] items-end p-4 relative shrink-0 w-full">
              {header}
            </div>
          )}

          <div className="flex-1 min-h-0 min-w-0 w-full overflow-y-auto">
            {children}
          </div>

          {isScrollable && footer && (
            <div className="flex flex-col gap-0 items-start p-4 relative shrink-0 w-full">
              {footer}
            </div>
          )}

          {!isScrollable && (
            <RadixDialog.Close
              className="absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none right-4 top-4"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </RadixDialog.Close>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
