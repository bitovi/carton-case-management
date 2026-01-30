import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/obra';
import { cn } from '@/lib/utils';
import type { CommentVoteButtonsProps } from './types';

export function CommentVoteButtons({
  commentId,
  likesCount,
  dislikesCount,
  currentUserVote,
  likeVoters,
  dislikeVoters,
  onVote,
  disabled = false,
}: CommentVoteButtonsProps) {
  const isLiked = currentUserVote === 'LIKE';
  const isDisliked = currentUserVote === 'DISLIKE';

  const handleLikeClick = () => {
    if (!disabled) {
      onVote(commentId, 'LIKE');
    }
  };

  const handleDislikeClick = () => {
    if (!disabled) {
      onVote(commentId, 'DISLIKE');
    }
  };

  const VoteButton = ({
    onClick,
    isActive,
    count,
    Icon,
    voters,
    label,
  }: {
    onClick: () => void;
    isActive: boolean;
    count: number;
    Icon: typeof ThumbsUp;
    voters: Array<{ id: string; name: string }>;
    label: string;
  }) => {
    const button = (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1 px-2 py-1 rounded-md transition-colors',
          'hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
          isActive && 'text-teal-600'
        )}
        aria-label={label}
      >
        <Icon
          className={cn('w-4 h-4', isActive ? 'fill-current' : 'fill-none')}
          strokeWidth={2}
        />
        {count > 0 && <span className="text-sm font-medium">{count}</span>}
      </button>
    );

    if (voters.length === 0) {
      return button;
    }

    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <p className="font-semibold mb-1">{label}</p>
              <ul className="text-sm space-y-0.5">
                {voters.map((voter) => (
                  <li key={voter.id}>{voter.name}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex items-center gap-2">
      <VoteButton
        onClick={handleLikeClick}
        isActive={isLiked}
        count={likesCount}
        Icon={ThumbsUp}
        voters={likeVoters}
        label="Liked by"
      />
      <VoteButton
        onClick={handleDislikeClick}
        isActive={isDisliked}
        count={dislikesCount}
        Icon={ThumbsDown}
        voters={dislikeVoters}
        label="Disliked by"
      />
    </div>
  );
}
