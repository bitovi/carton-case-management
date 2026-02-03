import type { ComponentPropsWithoutRef } from 'react';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /**
   * The checked state of the checkbox
   * @default false
   * @figma Variant: Checked (False | True | Indeterminate)
   */
  checked?: boolean | 'indeterminate';

  /**
   * Whether the checkbox has a validation error
   * @default false
   * @figma Variant: State (Error | Error Focus)
   */
  error?: boolean;

  /**
   * Whether the checkbox is disabled
   * @default false
   * @figma Variant: State (Disabled)
   */
  disabled?: boolean;

  /**
   * Callback when the checked state changes
   */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
