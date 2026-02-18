import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment }: CommentItemProps) {
  const utils = trpc.useUtils();

  // Fetch vote statistics for this comment
  const { data: voteStats } = trpc.comment.getVoteStats.useQuery({
    commentId: comment.id,
  });

  // Vote mutation with optimistic updates
  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.comment.getVoteStats.cancel({ commentId: comment.id });

      // Snapshot previous value
      const previousStats = utils.comment.getVoteStats.getData({
        commentId: comment.id,
      });

      // Optimistically update vote stats
      if (previousStats) {
        const { voteType } = variables;
        const currentVote = previousStats.userVote;

        let newUpvotes = previousStats.upvotes;
        let newDownvotes = previousStats.downvotes;
        let newUserVote: 'UP' | 'DOWN' | null = voteType;

        // If clicking same vote, toggle off
        if (currentVote === voteType) {
          newUserVote = null;
          if (voteType === 'UP') {
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
          }
        } else {
          // Different vote or no vote
          if (currentVote === 'UP') {
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else if (currentVote === 'DOWN') {
            newDownvotes = Math.max(0, newDownvotes - 1);
          }

          if (voteType === 'UP') {
            newUpvotes = newUpvotes + 1;
          } else {
            newDownvotes = newDownvotes + 1;
          }
        }

        utils.comment.getVoteStats.setData(
          { commentId: comment.id },
          {
            ...previousStats,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote,
          }
        );
      }

      return { previousStats };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousStats) {
        utils.comment.getVoteStats.setData(
          { commentId: comment.id },
          context.previousStats
        );
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.comment.getVoteStats.invalidate({ commentId: comment.id });
    },
  });

  const handleUpvote = () => {
    voteMutation.mutate({
      commentId: comment.id,
      voteType: 'UP',
    });
  };

  const handleDownvote = () => {
    voteMutation.mutate({
      commentId: comment.id,
      voteType: 'DOWN',
    });
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex gap-2 items-center">
        <div className="w-10 flex items-center justify-center text-sm font-semibold text-gray-900">
          {comment.author.firstName[0]}{comment.author.lastName[0]}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">
            {comment.author.firstName} {comment.author.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{comment.content}</p>
      {voteStats && (
        <ReactionStatistics
          userVote={voteStats.userVote === 'UP' ? 'up' : voteStats.userVote === 'DOWN' ? 'down' : 'none'}
          upvotes={voteStats.upvotes}
          upvoters={voteStats.upvoters}
          downvotes={voteStats.downvotes}
          downvoters={voteStats.downvoters}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      )}
    </div>
  );
}
