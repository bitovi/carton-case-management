export interface RichCheckboxGroupProps {
  /**
   * Checked state
   * @default false
   * @figma Variant: Checked?
   */
  checked?: boolean;
  
  /**
   * Flipped layout (label on left, checkbox on right)
   * @default false
   * @figma Variant: Flipped
   */
  flipped?: boolean;
  
  /**
   * Show secondary text line
   * @default false
   * @figma Boolean: Show Line 2
   */
  showLine2?: boolean;
  
  /**
   * Label text
   * @figma Text: Label
   */
  label: string;
  
  /**
   * Secondary text (shown when showLine2 is true)
   * @figma Text: Secondary text
   */
  secondaryText?: string;
  
  /**
   * Change handler
   */
  onCheckedChange?: (checked: boolean) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
