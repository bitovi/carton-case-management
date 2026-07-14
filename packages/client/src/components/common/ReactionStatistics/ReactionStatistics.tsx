import { cn } from '@/lib/utils';
import { VoteButton } from '../VoteButton';
import type { ReactionStatisticsProps } from './types';

export function ReactionStatistics({
  userVote = 'none',
  upvotes = 0,
  upvoters,
  downvotes = 0,
  downvoters,
  isPending = false,
  onUpvote,
  onDownvote,
  className
}: ReactionStatisticsProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <VoteButton
        type="up"
        active={userVote === 'up'}
        count={upvotes}
        voters={upvoters}
        isPending={isPending}
        onClick={onUpvote}
      />
      <VoteButton
        type="down"
        active={userVote === 'down'}
        count={downvotes}
        voters={downvoters}
        isPending={isPending}
        onClick={onDownvote}
      />
    </div>
  );
}

