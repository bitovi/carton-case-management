import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './Button';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Visual style variant
   * @default 'default'
   * @figma Variant: Primary→default, Secondary, Outline, Ghost, Destructive
   */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';

  /**
   * Size variant
   * @default 'default'
   * @figma Size: Default→default, Large→lg, Small→sm, Mini→xs
   */
  size?: 'default' | 'sm' | 'lg' | 'xs';

  /**
   * Border radius style
   * @default 'default'
   * @figma Roundness: Default, Round
   */
  roundness?: 'default' | 'round';

  /**
   * Icon to display before the label
   * @figma Left icon slot
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after the label
   * @figma Right icon slot
   */
  rightIcon?: React.ReactNode;

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Render as child component (for composition with links, etc.)
   * @default false
   */
  asChild?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button content (label)
   */
  children?: React.ReactNode;
}
