import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment, caseId }: CommentItemProps) {
  const utils = trpc.useUtils();
  
  // Fetch vote stats for this comment
  const { data: voteStats } = trpc.comment.getVoteStats.useQuery({
    commentId: comment.id,
  });

  // Vote mutation with optimistic updates
  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await utils.comment.getVoteStats.cancel({ commentId: comment.id });

      // Snapshot previous value
      const previousStats = utils.comment.getVoteStats.getData({
        commentId: comment.id,
      });

      // Calculate new vote state optimistically
      if (previousStats) {
        let newUpvotes = previousStats.upvotes;
        let newDownvotes = previousStats.downvotes;
        let newUserVote: 'none' | 'up' | 'down' = 'none';
        
        const clickedVote = variables.voteType === 'UP' ? 'up' : 'down';
        
        // If user clicked same vote, remove it
        if (previousStats.userVote === clickedVote) {
          if (clickedVote === 'up') {
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
          }
          newUserVote = 'none';
        }
        // If user clicked opposite vote, switch
        else if (previousStats.userVote !== 'none') {
          if (previousStats.userVote === 'up') {
            newUpvotes = Math.max(0, newUpvotes - 1);
            newDownvotes = newDownvotes + 1;
          } else {
            newDownvotes = Math.max(0, newDownvotes - 1);
            newUpvotes = newUpvotes + 1;
          }
          newUserVote = clickedVote;
        }
        // If user had no vote, add new vote
        else {
          if (clickedVote === 'up') {
            newUpvotes = newUpvotes + 1;
          } else {
            newDownvotes = newDownvotes + 1;
          }
          newUserVote = clickedVote;
        }

        // Optimistically update cache
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
          userVote={voteStats.userVote}
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
