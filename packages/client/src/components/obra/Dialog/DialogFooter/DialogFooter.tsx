import { cn } from '@/lib/utils';
import type { DialogFooterProps } from './types';

export function DialogFooter({ 
  className, 
  children 
}: DialogFooterProps) {
  return (
    <div 
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:justify-end',
        className
      )}
    >
      {children}
    </div>
  );
}
