import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DialogHeaderProps } from './types';

export function DialogHeader({ 
  title,
  onClose,
  className 
}: DialogHeaderProps) {
  return (
    <div className={cn('flex items-center justify-end', {'justify-between' : !!title}, className)}>
      {title && (
        <h2 className="text-xl font-semibold leading-6 tracking-tight text-foreground">
          {title}
        </h2>
      )}
      <button
        type="button"
        onClick={onClose}
        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
