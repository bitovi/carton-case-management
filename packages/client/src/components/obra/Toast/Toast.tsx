import { FolderX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/obra/Button';
import type { ToastProps } from './types';

export function Toast({
  type = 'Success',
  title,
  message,
  icon,
  onDismiss,
  open = true,
  className,
}: ToastProps) {
  if (!open) return null;

  // Default icons based on type
  const defaultIcon = type === 'Success' ? '🎉' : <FolderX className="h-6 w-6" />;
  const displayIcon = icon ?? defaultIcon;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onDismiss}
        aria-hidden="true"
      />
      
      {/* Toast modal */}
      <div
        role="alert"
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'bg-white rounded-lg shadow-lg p-6',
          'flex flex-col items-center gap-4',
          'min-w-[320px] max-w-[400px]',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-center justify-center">
          {typeof displayIcon === 'string' ? (
            <span className="text-4xl" aria-label={type}>
              {displayIcon}
            </span>
          ) : (
            displayIcon
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-center text-gray-900">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-center text-gray-700">
          {message}
        </p>

        {/* Dismiss button */}
        <Button
          variant="outline"
          onClick={onDismiss}
          className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Dismiss
        </Button>
      </div>
    </>
  );
}
