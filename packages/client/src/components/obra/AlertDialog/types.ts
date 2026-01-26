import { ReactNode } from 'react';


export interface AlertDialogProps {
  /**
   * Dialog type variant controlling layout and alignment
   * @default 'mobile'
   * Maps to Figma variant "Type"
   */
  type?: 'desktop' | 'mobile';

  /**
   * Dialog title text
   * Maps to Figma text layer "Title"
   */
  title: string;

  /**
   * Dialog description text
   * Maps to Figma text layer "Text"
   */
  description: string;

  /**
   * Custom primary action button
   * Use this for full control over button appearance
   */
  actionButton?: ReactNode;

  /**
   * Custom cancel/secondary button
   * Use this for full control over button appearance
   */
  cancelButton?: ReactNode;

  /**
   * Controlled open state
   */
  open?: boolean;

  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Trigger button content
   * Wraps content in AlertDialogTrigger
   */
  children?: ReactNode;
}

