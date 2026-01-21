import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { textareaVariants } from './Textarea';

/**
 * Textarea component props
 * @figma Obra/Textarea - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=279-99100
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /**
   * Whether the textarea has an error
   * @default false
   * @figma State: Error | Error Focus
   */
  error?: boolean;

  /**
   * Whether to use more rounded corners
   * @default false
   * @figma Roundness: Default (false) | Round (true)
   */
  rounded?: boolean;

  /**
   * Whether the textarea is resizable
   * @default true
   * @figma Boolean: showResizable
   */
  resizable?: boolean;
}
