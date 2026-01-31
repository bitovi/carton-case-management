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
  onClick,
  className,
}: VoteButtonProps) {
  const Icon = type === 'up' ? ThumbsUp : ThumbsDown;
  
  const colorClasses = active
    ? type === 'up'
      ? 'text-teal-500' 
      : 'text-red-500'   
    : 'text-slate-700';  

  const button = (
    <button
      type="button"
      onClick={onClick}
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

  // If voters are provided and there's a count, wrap with tooltip
  if (voters && voters.length > 0 && count !== undefined && count > 0) {
    const displayVoters = voters.slice(0, 3);
    const remainingCount = voters.length - 3;

    return (
      <VoterTooltip type={type} trigger={button}>
        <div className="flex flex-col gap-1 text-left">
          {displayVoters.map((voter, index) => (
            <span key={index} className="text-sm font-semibold">
              {voter}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-xs font-semibold">
              +{remainingCount} more
            </span>
          )}
        </div>
      </VoterTooltip>
    );
  }

  return button;
}

