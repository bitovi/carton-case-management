import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/obra';
import { trpc } from '@/lib/trpc';
import type { CommentVoteButtonProps } from './types';

export function CommentVoteButton({
  commentId,
  likeCount,
  dislikeCount,
  userVote,
  likeVoters,
  dislikeVoters,
  onVoteChange,
}: CommentVoteButtonProps) {
  const utils = trpc.useUtils();
  
  const toggleVote = trpc.vote.toggle.useMutation({
    onSuccess: () => {
      // Invalidate case query to refresh vote data
      utils.case.getById.invalidate();
      onVoteChange?.();
    },
  });

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    toggleVote.mutate({
      commentId,
      voteType,
    });
  };

  const isLiked = userVote === 'LIKE';
  const isDisliked = userVote === 'DISLIKE';

  const likeTooltipContent = likeVoters.length > 0 
    ? likeVoters.map(v => v.name).join(', ')
    : '';

  const dislikeTooltipContent = dislikeVoters.length > 0
    ? dislikeVoters.map(v => v.name).join(', ')
    : '';

  const LikeButton = (
    <button
      onClick={() => handleVote('LIKE')}
      disabled={toggleVote.isPending}
      className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50"
      aria-label={`Like comment (${likeCount} likes)`}
    >
      <ThumbsUp
        size={16}
        className={isLiked ? 'fill-teal-600 text-teal-600' : ''}
        strokeWidth={isLiked ? 2 : 1.5}
      />
      {likeCount > 0 && (
        <span className={`text-sm ${isLiked ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
          {likeCount}
        </span>
      )}
    </button>
  );

  const DislikeButton = (
    <button
      onClick={() => handleVote('DISLIKE')}
      disabled={toggleVote.isPending}
      className="flex items-center gap-1.5 text-gray-500 hover:text-teal-600 transition-colors disabled:opacity-50"
      aria-label={`Dislike comment (${dislikeCount} dislikes)`}
    >
      <ThumbsDown
        size={16}
        className={isDisliked ? 'fill-teal-600 text-teal-600' : ''}
        strokeWidth={isDisliked ? 2 : 1.5}
      />
      {dislikeCount > 0 && (
        <span className={`text-sm ${isDisliked ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
          {dislikeCount}
        </span>
      )}
    </button>
  );

  return (
    <div className="flex items-center gap-3">
      {likeVoters.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {LikeButton}
          </TooltipTrigger>
          <TooltipContent side="top">
            {likeTooltipContent}
          </TooltipContent>
        </Tooltip>
      ) : (
        LikeButton
      )}

      {dislikeVoters.length > 0 ? (
        <Tooltip>
          <TooltipTrigger asChild>
            {DislikeButton}
          </TooltipTrigger>
          <TooltipContent side="top">
            {dislikeTooltipContent}
          </TooltipContent>
        </Tooltip>
      ) : (
        DislikeButton
      )}
    </div>
  );
}
