import { TextareaHTMLAttributes } from "react";

export interface OldTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Border radius variant
   * @default 'default'
   * @figma Variant: Roundness
   */
  roundness?: 'default' | 'round';
  
  /**
   * Controls resize handle visibility
   * @default true
   * @figma Boolean: showResizable
   */
  showResizable?: boolean;
  
  /**
   * Error state - applies red border styling
   * @default false
   * @figma State: Error
   */
  error?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
