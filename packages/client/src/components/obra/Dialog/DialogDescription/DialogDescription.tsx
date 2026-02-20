import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import type { DialogDescriptionProps } from './types';

export function DialogDescription({ className, children, ...props }: DialogDescriptionProps) {
  return (
    <RadixDialog.Description className={cn('sr-only', className)} {...props}>
      {children}
    </RadixDialog.Description>
  );
}
