import { cn } from '@/lib/utils';
import { VoteButton } from '../VoteButton';
import type { ReactionStatisticsProps } from './types';

export function ReactionStatistics({
  userVote = 'none',
  upvotes = 0,
  upvoters,
  downvotes = 0,
  downvoters,
  onUpvote,
  onDownvote,
  className
}: ReactionStatisticsProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <VoteButton
        type="up"
        active={userVote === 'up'}
        showCount={true}
        count={upvotes}
        voters={upvoters}
        onClick={onUpvote}
      />
      <VoteButton
        type="down"
        active={userVote === 'down'}
        showCount={true}
        count={downvotes}
        voters={downvoters}
        onClick={onDownvote}
      />
    </div>
  );
}

