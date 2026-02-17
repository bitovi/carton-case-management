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

        let newStats = { ...previousStats };

        // If clicking same vote, remove it
        if (currentVote === voteType) {
          newStats.userVote = null;
          if (voteType === 'UP') {
            newStats.upvotes = Math.max(0, newStats.upvotes - 1);
          } else {
            newStats.downvotes = Math.max(0, newStats.downvotes - 1);
          }
        }
        // If switching votes
        else if (currentVote) {
          newStats.userVote = voteType;
          if (currentVote === 'UP') {
            newStats.upvotes = Math.max(0, newStats.upvotes - 1);
            newStats.downvotes += 1;
          } else {
            newStats.downvotes = Math.max(0, newStats.downvotes - 1);
            newStats.upvotes += 1;
          }
        }
        // First time voting
        else {
          newStats.userVote = voteType;
          if (voteType === 'UP') {
            newStats.upvotes += 1;
          } else {
            newStats.downvotes += 1;
          }
        }

        utils.comment.getVoteStats.setData({ commentId: comment.id }, newStats);
      }

      return { previousStats };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousStats) {
        utils.comment.getVoteStats.setData(
          { commentId: variables.commentId },
          context.previousStats
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to sync with server
      utils.comment.getVoteStats.invalidate({ commentId: variables.commentId });
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
          {comment.author.firstName[0]}
          {comment.author.lastName[0]}
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
