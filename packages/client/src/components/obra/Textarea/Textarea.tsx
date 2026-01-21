import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { TextareaProps } from './types';

/**
 * CVA variants for Textarea component
 * @figma Based on Obra Textarea designs with State and Roundness variants
 */
export const textareaVariants = cva(
  // Base styles
  [
    'flex min-h-[80px] w-full border bg-background px-3 py-2',
    'text-sm text-foreground placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      error: {
        false: 'border-input',
        true: 'border-destructive focus-visible:ring-destructive/50',
      },
      rounded: {
        false: 'rounded-md',
        true: 'rounded-xl',
      },
      resizable: {
        true: 'resize',
        false: 'resize-none',
      },
    },
    defaultVariants: {
      error: false,
      rounded: false,
      resizable: true,
    },
  }
);

/**
 * Textarea component - A multi-line text input field.
 *
 * @figma Obra/Textarea - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=279-99100
 *
 * @example
 * // Basic usage
 * <Textarea placeholder="Type your message here." />
 *
 * @example
 * // Error state
 * <Textarea error placeholder="Required field" />
 *
 * @example
 * // Rounded variant
 * <Textarea rounded placeholder="Rounded textarea" />
 *
 * @example
 * // Non-resizable
 * <Textarea resizable={false} />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error = false, rounded = false, resizable = true, ...props },
    ref
  ) => {
    return (
      <textarea
        className={cn(
          textareaVariants({ error, rounded, resizable }),
          className
        )}
        ref={ref}
        aria-invalid={error || undefined}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
