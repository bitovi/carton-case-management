import * as React from 'react';

/**
 * Size variant for the input
 * @figma Variant: Size
 */
export type InputSize = 'mini' | 'sm' | 'md' | 'lg';

/**
 * Border radius style
 * @figma Variant: Roundness
 */
export type InputRoundness = 'default' | 'round';

/**
 * Props for the Input component
 */
export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'> {
  /**
   * Size variant of the input
   * @default 'md'
   * @figma Variant: Size (Mini→mini, Small→sm, Regular→md, Large→lg)
   */
  size?: InputSize;

  /**
   * Border radius style
   * @default 'default'
   * @figma Variant: Roundness (Default→default, Round→round)
   */
  roundness?: InputRoundness;

  /**
   * Whether the input has a validation error
   * @default false
   * @figma State: Error, Error Focus
   */
  error?: boolean;

  /**
   * Optional decoration element on the left (icon, text prefix)
   * @figma Boolean: Decoration left
   */
  leftDecorator?: React.ReactNode;

  /**
   * Optional decoration element on the right (icon, text suffix)
   * @figma Boolean: Decoration right
   */
  rightDecorator?: React.ReactNode;
}
