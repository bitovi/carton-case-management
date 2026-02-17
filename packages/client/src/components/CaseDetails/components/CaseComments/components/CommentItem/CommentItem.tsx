import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment }: CommentItemProps) {
  const utils = trpc.useUtils();

  const { data: voteStats } = trpc.comment.getVoteStats.useQuery({
    commentId: comment.id,
  });

  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      await utils.comment.getVoteStats.cancel({ commentId: comment.id });
      const previousStats = utils.comment.getVoteStats.getData({ commentId: comment.id });

      if (previousStats) {
        const currentVote = previousStats.userVote;
        const newVote = variables.voteType === 'UP' ? 'up' : 'down';

        let newStats = { ...previousStats };

        if (currentVote === 'none') {
          if (newVote === 'up') {
            newStats = {
              ...previousStats,
              upvotes: previousStats.upvotes + 1,
              userVote: 'up' as const,
            };
          } else {
            newStats = {
              ...previousStats,
              downvotes: previousStats.downvotes + 1,
              userVote: 'down' as const,
            };
          }
        } else if (currentVote === newVote) {
          if (newVote === 'up') {
            newStats = {
              ...previousStats,
              upvotes: Math.max(0, previousStats.upvotes - 1),
              userVote: 'none' as const,
            };
          } else {
            newStats = {
              ...previousStats,
              downvotes: Math.max(0, previousStats.downvotes - 1),
              userVote: 'none' as const,
            };
          }
        } else {
          if (newVote === 'up') {
            newStats = {
              ...previousStats,
              upvotes: previousStats.upvotes + 1,
              downvotes: Math.max(0, previousStats.downvotes - 1),
              userVote: 'up' as const,
            };
          } else {
            newStats = {
              ...previousStats,
              downvotes: previousStats.downvotes + 1,
              upvotes: Math.max(0, previousStats.upvotes - 1),
              userVote: 'down' as const,
            };
          }
        }

        utils.comment.getVoteStats.setData({ commentId: comment.id }, newStats);
      }

      return { previousStats };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousStats) {
        utils.comment.getVoteStats.setData({ commentId: comment.id }, context.previousStats);
      }
    },
    onSettled: () => {
      utils.comment.getVoteStats.invalidate({ commentId: comment.id });
    },
  });

  const handleUpvote = () => {
    voteMutation.mutate({ commentId: comment.id, voteType: 'UP' });
  };

  const handleDownvote = () => {
    voteMutation.mutate({ commentId: comment.id, voteType: 'DOWN' });
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
      <ReactionStatistics
        userVote={(voteStats?.userVote as 'none' | 'up' | 'down' | undefined) || 'none'}
        upvotes={voteStats?.upvotes || 0}
        upvoters={voteStats?.upvoters}
        downvotes={voteStats?.downvotes || 0}
        downvoters={voteStats?.downvoters}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />
    </div>
  );
}
