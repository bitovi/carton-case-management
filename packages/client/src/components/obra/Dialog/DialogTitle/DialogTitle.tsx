import * as RadixDialog from '@radix-ui/react-dialog';
import type { DialogTitleProps } from './types';

export function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <RadixDialog.Title className={className} {...props}>
      {children}
    </RadixDialog.Title>
  );
}
