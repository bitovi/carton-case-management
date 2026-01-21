import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { SkeletonProps } from './types';

/**
 * CVA variants for Skeleton component
 * @figma Based on Obra Skeleton designs with 4 variants
 */
export const skeletonVariants = cva(
  // Base styles - all skeletons share these
  'animate-pulse bg-neutral-100',
  {
    variants: {
      variant: {
        /** Generic placeholder block */
        default: 'rounded-lg',
        /** Text line placeholder - SkeletonPlaceholderLine */
        line: 'h-4 rounded-lg',
        /** Rectangle placeholder - SkeletonPlaceholderObject */
        object: 'rounded-lg',
        /** Circle placeholder - SkeletonPlaceholderAvatar */
        avatar: 'rounded-full',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    compoundVariants: [
      // Avatar sizes (only apply when variant="avatar")
      { variant: 'avatar', size: 'sm', class: 'h-8 w-8' },
      { variant: 'avatar', size: 'md', class: 'h-12 w-12' },
      { variant: 'avatar', size: 'lg', class: 'h-16 w-16' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Skeleton component - A placeholder loading state for content.
 *
 * @figma Obra/Skeleton - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=303-246601
 *
 * @example
 * // Default placeholder block
 * <Skeleton className="h-4 w-[250px]" />
 *
 * @example
 * // Text line placeholder
 * <Skeleton variant="line" className="w-full" />
 * <Skeleton variant="line" className="w-3/4" />
 *
 * @example
 * // Avatar placeholder
 * <Skeleton variant="avatar" size="md" />
 *
 * @example
 * // Card loading pattern
 * <div className="flex items-center gap-4">
 *   <Skeleton variant="avatar" />
 *   <div className="space-y-2">
 *     <Skeleton variant="line" className="w-64" />
 *     <Skeleton variant="line" className="w-48" />
 *   </div>
 * </div>
 */
export function Skeleton({
  variant = 'default',
  size = 'md',
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size }), className)}
      aria-hidden="true"
      {...props}
    />
  );
}
