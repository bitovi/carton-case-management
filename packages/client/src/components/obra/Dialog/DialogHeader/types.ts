export interface DialogHeaderProps {
  /**
   * Header type variant
   * - Header: Shows title with close button
   * - Close Only: Shows only close button
   * - Icon Button Close: Shows close button in icon button style
   * @default 'Header'
   * @figma Variant: Type
   */
  type?: 'Header' | 'Close Only' | 'Icon Button Close';

  /**
   * Header title text (only shown when type='Header')
   * @figma Text: Title
   */
  title?: string;

  /**
   * Accessible description for screen readers 
   */
  description?: string;

  /**
   * Close button click handler
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
