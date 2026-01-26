import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the skeleton
   * - 'avatar': Circular shape, typical for user avatars (40x40px default)
   * - 'line': Thin rectangular shape for text lines (h-4)
   * - 'object': Rectangular shape for cards/images (flexible size)
   * @default 'object'
   */
  variant?: 'avatar' | 'line' | 'object';
  
  /** Additional CSS classes */
  className?: string;
}
