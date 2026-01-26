import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   * @default 'primary'
   * @figma Variant: Variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'ghost-muted' | 'destructive';

  /**
   * Size of the button
   * @default 'regular'
   * @figma Variant: Size
   */
  size?: 'large' | 'regular' | 'small' | 'mini';

  /**
   * Border radius style
   * @default 'default'
   * @figma Variant: Roundness
   */
  roundness?: 'default' | 'round';

  /**
   * Button content (text or other elements)
   * @figma Text: Label
   */
  children?: ReactNode;

  /**
   * Optional icon to display before the text
   * @figma Instance: Left icon wrapper
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon to display after the text
   * @figma Instance: Right icon wrapper
   */
  rightIcon?: ReactNode;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom className for additional styling
   */
  className?: string;

  /**
   * Accessible label for screen readers (if content is icon-only)
   */
  'aria-label'?: string;
}

