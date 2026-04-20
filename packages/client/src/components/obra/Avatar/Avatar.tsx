import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AvatarProps } from './types';

const sizeClasses = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-base',
};

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const showImage = src && !imgError;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium overflow-hidden shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? ''}
          className="size-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-label={alt}>{fallback ?? '?'}</span>
      )}
    </span>
  );
}
