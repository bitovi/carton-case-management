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
   * Simple string label for primary action button
   * Alternative to actionButton for basic use cases
   */
  actionLabel?: string;

  /**
   * Simple string label for cancel button
   * Alternative to cancelButton for basic use cases
   */
  cancelLabel?: string;

  /**
   * Callback when primary action button is clicked
   */
  onAction?: () => void;

  /**
   * Callback when cancel button is clicked
   */
  onCancel?: () => void;

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

