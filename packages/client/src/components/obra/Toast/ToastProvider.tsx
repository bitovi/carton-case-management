import * as ToastPrimitives from '@radix-ui/react-toast';
import { cn } from '@/lib/utils';
import type { ToastProviderProps } from './types';

export function ToastProvider({ 
  children, 
  duration = 4000,
  swipeDirection = 'down'
}: ToastProviderProps) {
  return (
    <ToastPrimitives.Provider duration={duration} swipeDirection={swipeDirection}>
      {children}
      <ToastPrimitives.Viewport
        className={cn(
          'fixed bottom-0 left-1/2 z-[100] flex max-h-screen w-full -translate-x-1/2 flex-col-reverse gap-2 p-4',
          'sm:bottom-0 sm:left-1/2 sm:w-auto sm:min-w-[420px] sm:max-w-[420px] sm:-translate-x-1/2 sm:flex-col-reverse',
        )}
      />
    </ToastPrimitives.Provider>
  );
}
