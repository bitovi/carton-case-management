import { ReactNode } from "react";

export interface AlertProps {
  /**
   * Alert type
   * @default 'Neutral'
   * @figma Variant: Type
   */
  type?: 'Neutral' | 'Error';
  
  /**
   * Primary alert text (Line 1)
   * @figma Text: Line 1
   */
  children: ReactNode;
  
  /**
   * Optional secondary text (Line 2)
   * @figma Text: Line 2
   */
  description?: string;
  
  /**
   * Whether to show Line 2
   * @default false (or true when description is provided)
   * @figma Boolean: Show Line 2
   */
  showLine2?: boolean;
  
  /**
   * Icon element to display
   * @figma Instance: Icon
   */
  icon?: ReactNode;
  
  /**
   * Whether to show the icon
   * @default false (or true when icon is provided)
   * @figma Boolean: Show Icon
   */
  showIcon?: boolean;
  
  /**
   * Whether to flip icon to the right side
   * @default false
   * @figma Boolean: Flip Icon
   */
  flipIcon?: boolean;
  
  /**
   * Action button element
   * @figma Instance: Button
   */
  action?: ReactNode;
  
  /**
   * Whether to show the action button
   * @default false (or true when action is provided)
   * @figma Boolean: Show Button
   */
  showButton?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
