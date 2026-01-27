import { ReactNode } from 'react';


export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  children: ReactNode;
}


export interface SelectTriggerProps {
  /** Size variants from Figma (affects height and spacing) */
  size?: 'mini' | 'small' | 'regular' | 'large';
  
  /** Layout variants from Figma (changes DOM structure) */
  layout?: 'single' | 'stacked';
  
  /** Label text (only shown in stacked layout) */
  label?: string;
  
  /** Placeholder text when no value selected */
  placeholder?: string;
  
  /** Prepend text (only shown in single layout) */
  prependText?: string;
  
  /** Left decoration (icon, avatar, checkbox, etc.) */
  leftDecoration?: ReactNode;
  
  /** Error state (shows red border) */
  error?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children (typically SelectValue) */
  children?: ReactNode;
}

export interface SelectContentProps {
  /** Spacing variants from Figma (padding around items) */
  spacing?: 'none' | '2px' | '8px' | '16px' | '24px';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Menu items and groups */
  children: ReactNode;
  
  /** Position relative to trigger */
  position?: 'item-aligned' | 'popper';
  
  /** Side of trigger to align to */
  side?: 'top' | 'right' | 'bottom' | 'left';
  
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
  
  /** Offset from trigger */
  sideOffset?: number;
}


export interface SelectItemProps {
  /** Required value for this item */
  value: string;
  
  /** Size variants from Figma */
  size?: 'regular' | 'large';
  
  /** Type variants from Figma (default or destructive) */
  type?: 'default' | 'destructive';
  
  /** Left decoration (icon, avatar, etc.) */
  leftDecoration?: ReactNode;
  
  /** Right decoration (in addition to check mark) */
  rightDecoration?: ReactNode;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Description text (second line) */
  description?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Item label text */
  children: ReactNode;
}


export interface SelectLabelProps {
  /** Size variants from Figma */
  size?: 'small' | 'regular';
  
  /** Indentation (adds left padding) */
  indented?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Label text */
  children: string;
}

export interface SelectSeparatorProps {
  /** Additional CSS classes */
  className?: string;
}


export interface SelectOverflowIndicatorProps {
  /** Scroll direction */
  direction: 'up' | 'down';
  
  /** Additional CSS classes */
  className?: string;
}


export type LeftDecorationType =
  | 'icon'                  
  | 'text'                  
  | 'checkbox'              
  | 'radio'                 
  | 'avatar'                
  | 'deco-icon-primary'     
  | 'deco-icon-outline'     
  | 'blank'                 
  | 'text-muted'            
  | 'icon-muted';           
