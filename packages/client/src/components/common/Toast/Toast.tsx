import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({ 
  type = 'success',
  title,
  message,
  showDismiss = true,
  onDismiss,
  className,
}: ToastProps) {
  const typeStyles = {
    success: {
      container: 'bg-card border-border',
      title: 'text-foreground',
      message: 'text-muted-foreground',
      emoji: '🎉',
    },
    error: {
      container: 'bg-card border-border',
      title: 'text-destructive',
      message: 'text-destructive/90',
      emoji: '⚠️',
    },
    deleted: {
      container: 'bg-card border-destructive',
      title: 'text-destructive',
      message: 'text-muted-foreground',
      emoji: '',
    },
  };

  const styles = typeStyles[type];

  return (
    <div 
      className={cn(
        'flex min-w-[320px] max-w-[600px] items-start gap-4 rounded-lg border bg-card p-4 shadow-lg',
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          {styles.emoji && <span className="text-lg">{styles.emoji}</span>}
          <h3 className={cn('text-sm font-semibold leading-5', styles.title)}>
            {title}
          </h3>
        </div>
        <p className={cn('text-sm font-normal leading-5', styles.message)}>
          {message}
        </p>
      </div>
      
      {showDismiss && onDismiss && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDismiss}
          className="shrink-0"
        >
          Dismiss
        </Button>
      )}
    </div>
  );
}
