import { cn } from '@/lib/utils';
import type { DialogFooterProps } from './types';

export function DialogFooter({ 
  type = '2 Buttons Right',
  className, 
  children 
}: DialogFooterProps) {
  const is2ButtonsRight = type === '2 Buttons Right';
  const is2FullWidthButtons = type === '2 Full-width Buttons';
  const isSingleFullWidthButton = type === 'Single Full-width Button';

  return (
    <div 
      className={cn(
        'flex flex-col gap-0 items-start p-4 w-full',
        className
      )}
    >
      <div
        className={cn(
          'flex w-full',
          {
            'gap-2 items-center justify-end': is2ButtonsRight,
            'gap-2 items-start justify-end rounded-[10px]': is2FullWidthButtons,
            'gap-0 items-start justify-end rounded-[10px]': isSingleFullWidthButton,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}
