import * as RadixDialog from '@radix-ui/react-dialog';
import { ComponentPropsWithoutRef } from 'react';

export interface DialogTitleProps extends ComponentPropsWithoutRef<typeof RadixDialog.Title> {
  /**
   * Additional CSS classes
   */
  className?: string;
}
