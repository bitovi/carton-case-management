import * as React from 'react';
import { cn } from '@/lib/utils';
import type { OldTextareaProps } from './types';

const roundnessClasses = {
  default: 'rounded-md',
  round: 'rounded-lg',
} as const;

export const OldTextarea = React.forwardRef<HTMLTextAreaElement, OldTextareaProps>(
  (
    {
      roundness = 'default',
      showResizable = true,
      error = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'h-[76px] w-full px-3 py-2',
          'bg-amber-50/30',
          'font-[Inter] text-sm font-normal leading-[21px] tracking-[0.5px]',
          'text-[#020617] placeholder:text-[#64748b]',
          'border-2 border-amber-200/40',
          'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
          roundnessClasses[roundness],
          {"resize-vertical": showResizable, "resize-none": !showResizable},
          'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_var(--focus-ring,#CBD5E1)]',
          {"!border-[#ef4444] focus-visible:!shadow-[0_0_0_3px_var(--focus-ring-error,#FCA5A5)]": error},
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[#f8fafc] disabled:text-[#94a3b8]',
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

OldTextarea.displayName = 'OldTextarea';
