import { cn } from '@/lib/utils';
import type { BadgeProps } from './types';


export function Badge({
  variant = 'primary',
  roundness = 'default',
  children,
  iconLeft,
  iconRight,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex',
        'items-center',
        'justify-center',
        'gap-[6px]',
        'px-2',
        'py-[3px]',
        'min-h-[24px]',
        'text-xs',
        'font-semibold',
        'leading-4',
        'tracking-[0.18px]',
        'transition-colors',
        'focus-visible:outline-none',
        {
          'bg-primary text-primary-foreground': variant === 'primary',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-transparent border border-border text-foreground':
            variant === 'outline',
          'bg-transparent text-foreground': variant === 'ghost',
          'bg-destructive text-white': variant === 'destructive',
        },
        {
          'rounded-lg': roundness === 'default',
          'rounded-full': roundness === 'round',
        },
        {
          'focus-visible:ring-2 focus-visible:ring-offset-2':
            variant !== 'destructive',
          'focus-visible:shadow-[0_0_0_3px_var(--focus-ring,#CBD5E1)]':
            variant !== 'destructive',
          'focus-visible:shadow-[0_0_0_3px_var(--focus-ring-error,#FCA5A5)]':
            variant === 'destructive',
        },
        className
      )}
    >
      {iconLeft && <span className="inline-flex">{iconLeft}</span>}
      <span className="inline-flex">{children}</span>
      {iconRight && <span className="inline-flex">{iconRight}</span>}
    </span>
  );
}

