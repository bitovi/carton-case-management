import { cn } from '@/lib/utils';
import { HoverCard } from '@/components/obra/HoverCard';
import type { VoterTooltipProps } from './types';

export function VoterTooltip({ 
  type = 'up',
  children,
  trigger,
  className
}: VoterTooltipProps) {
  const textColorClass = type === 'up' ? 'text-teal-500' : 'text-red-500';
  
  return (
    <HoverCard trigger={trigger}>
      <div 
        className={cn(
          'w-full flex gap-0 items-start justify-start',
          'rounded-lg p-3',
          textColorClass,
          className
        )}
      >
        {children}
      </div>
    </HoverCard>
  );
}
