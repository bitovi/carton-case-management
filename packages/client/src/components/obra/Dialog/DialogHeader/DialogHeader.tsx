import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
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
        'flex h-[52px] w-full',
        {
          'items-center justify-between px-4': isHeader,
          'items-center justify-end px-4': isCloseOnly || isIconButtonClose,
        },
        className
      )}
    >
      {isHeader && (
        <>
          <h2 className="text-xl font-semibold leading-6 text-foreground">
            {title || 'Title'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      )}
      {isCloseOnly && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isIconButtonClose && (
        <Button
          variant="ghost"
          size="regular"
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
