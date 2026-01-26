import { cn } from '@/lib/utils';
import type { SkeletonProps } from './types';

const variantClasses = {
  avatar: 'h-10 w-10 rounded-full',
  line: 'h-4 w-full rounded',
  object: 'rounded-md',
} as const;

export function Skeleton({
  variant = 'object',
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-50',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
