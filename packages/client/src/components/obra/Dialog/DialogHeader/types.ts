export interface DialogHeaderProps {
  /**
   * Header title text
   */
  title?: string;

  /**
   * Close button click handler
   */
  onClose?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}
