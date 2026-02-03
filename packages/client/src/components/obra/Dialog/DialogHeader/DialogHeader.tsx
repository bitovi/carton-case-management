import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DialogHeaderProps } from './types';

export function DialogHeader({ 
  type = 'Header',
  title,
  onClose,
  className 
}: DialogHeaderProps) {
  const isHeader = type === 'Header';
  const isCloseOnly = type === 'Close Only';
  const isIconButtonClose = type === 'Icon Button Close';

  return (
    <div 
      className={cn(
        'flex flex-col h-[52px] w-full',
        {
          'items-start justify-between p-4': isHeader,
          'items-end p-4': isCloseOnly,
          'items-end justify-center pl-4 py-4': isIconButtonClose,
        },
        className
      )}
    >
      {isHeader && (
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold leading-6 text-foreground">
            {title || 'Title'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
      {isCloseOnly && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      {isIconButtonClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center min-h-9 min-w-9 p-2 rounded-lg bg-transparent hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
