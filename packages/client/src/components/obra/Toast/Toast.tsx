import { useEffect } from 'react';
import { X, PartyPopper, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  id,
  type = 'success',
  title,
  message,
  icon,
  onDismiss,
  className,
}: ToastProps) {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'success':
        return <PartyPopper className="h-5 w-5 text-green-600" />;
      case 'deleted':
        return <TriangleAlert className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 rounded-lg border bg-card p-4 shadow-lg',
        'sm:max-w-md',
        className
      )}
      role="alert"
      aria-live="polite"
      data-toast-id={id}
    >
      {/* Icon */}
      <div className="flex shrink-0 items-center pt-0.5">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold leading-[21px] tracking-[0.07px]">
          {title}
        </p>
        <p className="text-sm font-normal leading-[21px] tracking-[0.07px] text-muted-foreground">
          {message}
        </p>
      </div>

      {/* Dismiss Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onDismiss}
        className="shrink-0"
        aria-label="Dismiss notification"
      >
        Dismiss
      </Button>
    </div>
  );
}
