import { ReactNode } from 'react';

export interface DialogFooterProps {
  /**
   * Footer type variant
   * - 2 Buttons Right: Two buttons aligned to the right
   * - 2 Full-width Buttons: Two buttons stacked/side-by-side full width
   * - Single Full-width Button: Single button spanning full width
   * @default '2 Buttons Right'
   * @figma Variant: Type
   */
  type?: '2 Buttons Right' | '2 Full-width Buttons' | 'Single Full-width Button';

  /**
   * Footer content
   * Typically action buttons (Cancel, Save, etc.)
   */
  children: ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}
