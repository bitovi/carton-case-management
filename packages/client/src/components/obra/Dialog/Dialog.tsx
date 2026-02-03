import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DialogProps } from './types';

export function Dialog({
  type = 'Desktop',
  children,
  header,
  footer,
  onClose,
  className,
}: DialogProps) {
  const isScrollable = type === 'Desktop Scrollable' || type === 'Mobile Full Screen Scrollable';

  return (
    <div
      className={cn(
        'bg-background flex flex-col relative shadow-lg',
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

      <div className="flex flex-1 gap-0 items-start justify-start min-h-0 min-w-0 relative w-full overflow-y-auto">
        {children}
      </div>

      {isScrollable && footer && (
        <div className="flex flex-col gap-0 items-start p-4 relative shrink-0 w-full">
          {footer}
        </div>
      )}

      {!isScrollable && (
        <button
          type="button"
          onClick={onClose}
          className="absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none right-4 top-4"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
