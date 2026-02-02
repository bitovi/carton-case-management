import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/obra';
import type { CommentVoteButtonsProps } from './types';

export function CommentVoteButtons({ commentId, votes, currentUserId }: CommentVoteButtonsProps) {
  const utils = trpc.useUtils();

  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches to prevent race conditions
      await utils.case.getById.cancel();

      // Snapshot previous value
      const previousData = utils.case.getById.getData();

      // Optimistically update the UI
      if (previousData) {
        utils.case.getById.setData({ id: previousData.id }, (old) => {
          if (!old) return old;

          return {
            ...old,
            comments: old.comments?.map((comment) => {
              if (comment.id !== commentId) return comment;

              // Calculate new votes array
              let newVotes = [...(comment.votes || [])];
              const userVoteIndex = newVotes.findIndex((v) => v.userId === currentUserId);

              if (variables.voteType === null) {
                // Remove vote
                newVotes = newVotes.filter((v) => v.userId !== currentUserId);
              } else if (userVoteIndex !== -1) {
                // Update existing vote
                newVotes[userVoteIndex] = {
                  ...newVotes[userVoteIndex],
                  voteType: variables.voteType as 'LIKE' | 'DISLIKE',
                };
              } else {
                // Add new vote
                newVotes.push({
                  id: `temp-${Date.now()}`,
                  commentId,
                  userId: currentUserId,
                  voteType: variables.voteType as 'LIKE' | 'DISLIKE',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  user: {
                    id: currentUserId,
                    name: 'You',
                    email: '',
                  },
                });
              }

              return {
                ...comment,
                votes: newVotes,
              };
            }),
          };
        });
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        utils.case.getById.setData({ id: context.previousData.id }, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate();
    },
  });

  // Calculate vote counts
  const likeCount = votes.filter((v) => v.voteType === 'LIKE').length;
  const dislikeCount = votes.filter((v) => v.voteType === 'DISLIKE').length;

  // Check if current user has voted
  const userVote = votes.find((v) => v.userId === currentUserId);
  const hasLiked = userVote?.voteType === 'LIKE';
  const hasDisliked = userVote?.voteType === 'DISLIKE';

  // Get list of users who liked/disliked
  const likingUsers = votes.filter((v) => v.voteType === 'LIKE').map((v) => v.user.name);
  const dislikingUsers = votes.filter((v) => v.voteType === 'DISLIKE').map((v) => v.user.name);

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    // If already voted with this type, remove the vote
    if (userVote?.voteType === voteType) {
      voteMutation.mutate({ commentId, voteType: null });
    } else {
      voteMutation.mutate({ commentId, voteType });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleVote('LIKE')}
              disabled={voteMutation.isPending}
              className={`flex items-center gap-1 transition-colors ${
                hasLiked
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-400 hover:text-gray-600'
              } ${voteMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={hasLiked ? 'Remove like' : 'Like comment'}
            >
              <ThumbsUp
                size={16}
                className={hasLiked ? 'fill-current' : ''}
                strokeWidth={hasLiked ? 2 : 1.5}
              />
              {likeCount > 0 && <span className="text-xs font-medium">{likeCount}</span>}
            </button>
          </TooltipTrigger>
          {likingUsers.length > 0 && (
            <TooltipContent>
              <p className="text-xs">
                {likingUsers.length === 1
                  ? likingUsers[0]
                  : `${likingUsers.slice(0, 3).join(', ')}${likingUsers.length > 3 ? ` +${likingUsers.length - 3} more` : ''}`}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleVote('DISLIKE')}
              disabled={voteMutation.isPending}
              className={`flex items-center gap-1 transition-colors ${
                hasDisliked
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-gray-400 hover:text-gray-600'
              } ${voteMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-label={hasDisliked ? 'Remove dislike' : 'Dislike comment'}
            >
              <ThumbsDown
                size={16}
                className={hasDisliked ? 'fill-current' : ''}
                strokeWidth={hasDisliked ? 2 : 1.5}
              />
              {dislikeCount > 0 && <span className="text-xs font-medium">{dislikeCount}</span>}
            </button>
          </TooltipTrigger>
          {dislikingUsers.length > 0 && (
            <TooltipContent>
              <p className="text-xs">
                {dislikingUsers.length === 1
                  ? dislikingUsers[0]
                  : `${dislikingUsers.slice(0, 3).join(', ')}${dislikingUsers.length > 3 ? ` +${dislikingUsers.length - 3} more` : ''}`}
              </p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
