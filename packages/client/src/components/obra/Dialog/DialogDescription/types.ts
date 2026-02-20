import * as RadixDialog from '@radix-ui/react-dialog';
import { ComponentPropsWithoutRef } from 'react';

export interface DialogDescriptionProps extends ComponentPropsWithoutRef<typeof RadixDialog.Description> {
  /**
   * Additional CSS classes
   */
  className?: string;
}
