import type { ReactNode } from 'react';

export interface BadgeProps {
  /**
   * Visual style variant
   * @default 'primary'
   * @figma Variant: Variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  
  /**
   * Border radius style
   * @default 'default'
   * @figma Variant: Roundness
   */
  roundness?: 'default' | 'round';
  
  /**
   * Badge text content
   * @figma Text: Label
   */
  children: ReactNode;
  
  /**
   * Optional icon displayed on the left side
   * @figma Boolean: Show Icon Left
   */
  iconLeft?: ReactNode;
  
  /**
   * Optional icon displayed on the right side
   * @figma Boolean: Show Icon Right
   */
  iconRight?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

