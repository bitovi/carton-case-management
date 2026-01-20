import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { InputProps } from './types';

const inputVariants = cva(
  // Base styles matching Figma design
  [
    'flex w-full border border-input bg-transparent shadow-xs transition-colors',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        mini: 'h-6 text-xs px-2 gap-1',
        sm: 'h-8 text-sm px-3 gap-1.5',
        md: 'h-9 text-sm px-3 gap-2',
        lg: 'h-10 text-base px-4 gap-2',
      },
      roundness: {
        default: 'rounded-md',
        round: 'rounded-full',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'focus-visible:ring-ring',
      },
    },
    defaultVariants: {
      size: 'md',
      roundness: 'default',
      error: false,
    },
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size = 'md',
      roundness = 'default',
      error = false,
      leftDecorator,
      rightDecorator,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasDecorators = leftDecorator || rightDecorator;

    // When we have decorators, wrap input in a styled container
    if (hasDecorators) {
      return (
        <div
          className={cn(
            inputVariants({ size, roundness, error }),
            'items-center',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          {leftDecorator && (
            <span className="shrink-0 text-muted-foreground">
              {leftDecorator}
            </span>
          )}
          <input
            type={type}
            className={cn(
              'flex-1 bg-transparent outline-none min-w-0',
              'placeholder:text-muted-foreground',
              'disabled:cursor-not-allowed'
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {rightDecorator && (
            <span className="shrink-0 text-muted-foreground">
              {rightDecorator}
            </span>
          )}
        </div>
      );
    }

    // Simple input without decorators
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, roundness, error }), className)}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
