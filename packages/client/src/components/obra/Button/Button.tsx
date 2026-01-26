import { cn } from '@/lib/utils';
import type { ButtonProps } from './types';

const sizeClasses = {
  large: 'h-10 px-6 text-sm gap-2',
  regular: 'h-9 px-4 text-sm gap-2',
  small: 'h-8 px-3 text-sm gap-2',
  mini: 'h-6 px-2 text-xs gap-1.5',
} as const;

const variantClasses = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  outline:
    'bg-transparent text-foreground border border-border hover:bg-accent hover:text-accent-foreground shadow-xs',
  ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
  'ghost-muted': 'bg-transparent text-muted-foreground/50 hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
} as const;

const roundnessClasses = {
  default: 'rounded-lg',
  round: 'rounded-full',
} as const;

export function Button({
  variant = 'primary',
  size = 'regular',
  roundness = 'default',
  leftIcon,
  rightIcon,
  disabled = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'font-semibold tracking-[0.03em] transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizeClasses[size],
        variantClasses[variant],
        roundnessClasses[roundness],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {leftIcon}
        </span>
      )}
      <span className="inline-flex">{children}</span>
      {rightIcon && (
        <span className="inline-flex shrink-0 items-center justify-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

