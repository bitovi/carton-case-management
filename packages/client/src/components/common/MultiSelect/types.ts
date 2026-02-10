import { ReactNode } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  /**
   * Size variants (affects height and spacing)
   */
  size?: 'mini' | 'small' | 'regular' | 'large';
  
  /**
   * Layout variants (changes DOM structure)
   */
  layout?: 'single' | 'stacked';
  
  /**
   * Label text (only shown in stacked layout)
   */
  label?: string;
  
  /**
   * Available options
   */
  options: MultiSelectOption[];
  
  /**
   * Currently selected values
   */
  value: string[];
  
  /**
   * Change handler
   */
  onChange: (value: string[]) => void;
  
  /**
   * Placeholder text when no selection
   * @default "None selected"
   */
  placeholder?: string;
  
  /**
   * Prepend text (only shown in single layout)
   */
  prependText?: string;
  
  /**
   * Left decoration (icon, avatar, etc.)
   */
  leftDecoration?: ReactNode;
  
  /**
   * Error state (shows red border)
   */
  error?: boolean;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}
