import { trpc } from '@/lib/trpc';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment }: CommentItemProps) {
  const utils = trpc.useUtils();

  // Fetch vote data for this comment
  const { data: voteData } = trpc.comment.getVotes.useQuery({
    commentId: comment.id,
  });

  // Toggle vote mutation
  const toggleVoteMutation = trpc.comment.toggleVote.useMutation({
    onSuccess: () => {
      // Invalidate votes query to refetch updated counts
      utils.comment.getVotes.invalidate({ commentId: comment.id });
    },
  });

  const handleUpvote = () => {
    toggleVoteMutation.mutate({
      commentId: comment.id,
      voteType: 'UP',
    });
  };

  const handleDownvote = () => {
    toggleVoteMutation.mutate({
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
      {voteData && (
        <ReactionStatistics
          userVote={voteData.userVote as 'none' | 'up' | 'down'}
          upvotes={voteData.upvotes}
          upvoters={voteData.upvoters}
          downvotes={voteData.downvotes}
          downvoters={voteData.downvoters}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      )}
    </div>
  );
}
