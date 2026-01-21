import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { skeletonVariants } from './Skeleton';

/**
 * Visual variant of the skeleton
 * @figma Maps to different Figma component variants
 */
export type SkeletonVariant = 'default' | 'line' | 'object' | 'avatar';

/**
 * Size of the avatar skeleton
 * @figma Avatar variant sizing
 */
export type SkeletonAvatarSize = 'sm' | 'md' | 'lg';

/**
 * Skeleton component props
 * @figma Obra/Skeleton - https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd?node-id=303-246601
 */
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Visual variant of the skeleton
   * @default 'default'
   * @figma Variant mappings:
   *   - default: Generic placeholder
   *   - line: SkeletonPlaceholderLine
   *   - object: SkeletonPlaceholderObject
   *   - avatar: SkeletonPlaceholderAvatar
   */
  variant?: SkeletonVariant;

  /**
   * Size of the avatar (only applies when variant="avatar")
   * @default 'md'
   * @figma Avatar size: 32px (sm), 48px (md), 64px (lg)
   */
  size?: SkeletonAvatarSize;
}
