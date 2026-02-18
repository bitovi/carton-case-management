import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common';
import type { CommentItemProps } from './types';

export function CommentItem({ comment }: CommentItemProps) {
  const utils = trpc.useUtils();

  // Fetch vote stats for this comment
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
        let newUserVote: 'none' | 'up' | 'down' = 'none';
        let newUpvoteCount = previousStats.upvoteCount;
        let newDownvoteCount = previousStats.downvoteCount;
        let newUpvoters = [...previousStats.upvoters];
        let newDownvoters = [...previousStats.downvoters];

        const currentUser = utils.user.list.getData()?.[0];
        const currentUserName = currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : 'Unknown User';

        // Toggle logic
        if (voteType === 'UP') {
          if (previousStats.userVote === 'up') {
            // Remove upvote
            newUserVote = 'none';
            newUpvoteCount--;
            newUpvoters = newUpvoters.filter((v) => v !== currentUserName);
          } else if (previousStats.userVote === 'down') {
            // Switch from downvote to upvote
            newUserVote = 'up';
            newUpvoteCount++;
            newDownvoteCount--;
            newUpvoters.push(currentUserName);
            newDownvoters = newDownvoters.filter((v) => v !== currentUserName);
          } else {
            // Add upvote
            newUserVote = 'up';
            newUpvoteCount++;
            newUpvoters.push(currentUserName);
          }
        } else {
          // voteType === 'DOWN'
          if (previousStats.userVote === 'down') {
            // Remove downvote
            newUserVote = 'none';
            newDownvoteCount--;
            newDownvoters = newDownvoters.filter((v) => v !== currentUserName);
          } else if (previousStats.userVote === 'up') {
            // Switch from upvote to downvote
            newUserVote = 'down';
            newDownvoteCount++;
            newUpvoteCount--;
            newDownvoters.push(currentUserName);
            newUpvoters = newUpvoters.filter((v) => v !== currentUserName);
          } else {
            // Add downvote
            newUserVote = 'down';
            newDownvoteCount++;
            newDownvoters.push(currentUserName);
          }
        }

        utils.comment.getVoteStats.setData(
          { commentId: comment.id },
          {
            upvoteCount: newUpvoteCount,
            downvoteCount: newDownvoteCount,
            upvoters: newUpvoters,
            downvoters: newDownvoters,
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
          userVote={voteStats.userVote as 'none' | 'up' | 'down'}
          upvotes={voteStats.upvoteCount}
          upvoters={voteStats.upvoters}
          downvotes={voteStats.downvoteCount}
          downvoters={voteStats.downvoters}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      )}
    </div>
  );
}
