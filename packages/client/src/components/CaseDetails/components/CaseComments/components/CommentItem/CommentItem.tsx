import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment, caseId, currentUserId }: CommentItemProps) {
  const utils = trpc.useUtils();

  // Calculate vote statistics from the votes array
  const upvotes = comment.votes.filter((v) => v.voteType === 'UP');
  const downvotes = comment.votes.filter((v) => v.voteType === 'DOWN');
  const userVote = currentUserId
    ? comment.votes.find((v) => v.userId === currentUserId)?.voteType
    : undefined;

  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update vote in cache
      if (previousCase && currentUserId) {
        const updatedComments = previousCase.comments.map((c) => {
          if (c.id !== comment.id) return c;

          // Remove existing user vote
          const votesWithoutUser = c.votes.filter((v) => v.userId !== currentUserId);

          // Add new vote if voteType is not null
          const newVotes =
            variables.voteType === null
              ? votesWithoutUser
              : [
                  ...votesWithoutUser,
                  {
                    id: `temp-${Date.now()}`,
                    commentId: c.id,
                    userId: currentUserId,
                    voteType: variables.voteType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                      id: currentUserId,
                      firstName: 'You',
                      lastName: '',
                    },
                  },
                ];

          return {
            ...c,
            votes: newVotes,
          };
        });

        utils.case.getById.setData(
          { id: caseId },
          {
            ...previousCase,
            comments: updatedComments,
          }
        );
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  const handleUpvote = () => {
    if (!currentUserId) return;
    
    // If already upvoted, remove vote (toggle off)
    // Otherwise, set upvote (will replace downvote if exists)
    const newVoteType = userVote === 'UP' ? null : 'UP';
    voteMutation.mutate({
      commentId: comment.id,
      voteType: newVoteType,
    });
  };

  const handleDownvote = () => {
    if (!currentUserId) return;
    
    // If already downvoted, remove vote (toggle off)
    // Otherwise, set downvote (will replace upvote if exists)
    const newVoteType = userVote === 'DOWN' ? null : 'DOWN';
    voteMutation.mutate({
      commentId: comment.id,
      voteType: newVoteType,
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
      <ReactionStatistics
        userVote={userVote ? (userVote === 'UP' ? 'up' : 'down') : 'none'}
        upvotes={upvotes.length}
        upvoters={upvotes.map((v) => `${v.user.firstName} ${v.user.lastName}`)}
        downvotes={downvotes.length}
        downvoters={downvotes.map((v) => `${v.user.firstName} ${v.user.lastName}`)}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />
    </div>
  );
}
