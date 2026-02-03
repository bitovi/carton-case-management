export interface CheckboxGroupProps {
  /**
   * Layout variant
   * @default 'inline'
   * @figma Variant: Layout
   */
  layout?: 'inline' | 'block';
  
  /**
   * Checked state
   * @default false
   * @figma Variant: Checked?
   */
  checked?: boolean;
  
  /**
   * Label text
   * @figma Text: Label
   */
  label: string;
  
  /**
   * Change handler
   */
  onCheckedChange?: (checked: boolean) => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
