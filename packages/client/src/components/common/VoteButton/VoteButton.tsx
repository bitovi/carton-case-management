import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { VoterTooltip } from '../VoterTooltip';
import type { VoteButtonProps } from './types';

export function VoteButton({
  type,
  active = false,
  showCount = true,
  count,
  voters,
  isPending = false,
  onClick,
  className,
}: VoteButtonProps) {
  const [isMobileTooltipOpen, setIsMobileTooltipOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const Icon = type === 'up' ? ThumbsUp : ThumbsDown;
  const hasTooltip = Boolean(voters && voters.length > 0 && count !== undefined && count > 0 && !isPending);

  const colorClasses = active
    ? type === 'up'
      ? 'text-teal-500' 
      : 'text-red-500'   
    : 'text-slate-700';  

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' || !hasTooltip) {
      return;
    }
    clearLongPressTimer();
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      setIsMobileTooltipOpen(true);
      setTimeout(() => setIsMobileTooltipOpen(false), 3000);
    }, 2000);
  };

  const handlePointerUp = () => {
    clearLongPressTimer();
  };

  const handleClick = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    onClick?.();
  };

  const button = (
    <button
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={cn(
        'inline-flex items-center gap-2 transition-colors hover:opacity-80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        colorClasses,
        className
      )}
      aria-label={type === 'up' ? 'Upvote' : 'Downvote'}
      aria-pressed={active}
    >
      <Icon className="h-6 w-6 shrink-0" />
      {showCount && count !== undefined && (
        <span className="text-sm leading-[21px] tracking-[0.07px]">
          {count}
        </span>
      )}
    </button>
  );

  if (hasTooltip) {
    const resolvedVoters = voters ?? [];
    const displayVoters = resolvedVoters.slice(0, 4);
    const remainingCount = resolvedVoters.length - 4;
    const tooltipContent = (
      <div className="flex flex-col gap-1 text-left">
        {displayVoters.map((voter, index) => (
          <span key={index} className="text-sm font-semibold">
            {voter}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs font-semibold">
            and {remainingCount} others
          </span>
        )}
      </div>
    );

    return (
      <div className="relative inline-flex">
        <VoterTooltip type={type} trigger={button}>
          {tooltipContent}
        </VoterTooltip>
        {isMobileTooltipOpen && (
          <div
            className={cn(
              'absolute left-1/2 top-full z-50 mt-2 w-[200px] -translate-x-1/2 rounded-lg border border-border bg-card p-3 shadow-md',
              type === 'up' ? 'text-teal-500' : 'text-red-500'
            )}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    );
  }

  return button;
}
