import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import { useReaction } from '@/hooks/useReaction';
import type { CommentItemProps } from './types';

export function CommentItem({ comment }: CommentItemProps) {
  const {
    upvotes,
    downvotes,
    upvoters,
    downvoters,
    userVote,
    toggleUpvote,
    toggleDownvote,
  } = useReaction({
    entityType: 'COMMENT',
    entityId: comment.id,
  });

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
      <div className="mt-1">
        <ReactionStatistics
          userVote={userVote}
          upvotes={upvotes}
          downvotes={downvotes}
          upvoters={upvoters}
          downvoters={downvoters}
          onUpvote={toggleUpvote}
          onDownvote={toggleDownvote}
        />
      </div>
    </div>
  );
}
