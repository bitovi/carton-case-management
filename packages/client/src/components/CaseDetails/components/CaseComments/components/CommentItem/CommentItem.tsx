import { useState } from 'react';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CommentItemProps } from './types';

export function CommentItem({ comment, currentUser }: CommentItemProps) {
  const [userVote, setUserVote] = useState<'none' | 'up' | 'down'>('none');

  const handleVote = (direction: 'up' | 'down') => {
    if (!currentUser) return;
    setUserVote((prev) => (prev === direction ? 'none' : direction));
  };

  const currentUserName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';
  const upvotes = userVote === 'up' ? 1 : 0;
  const downvotes = userVote === 'down' ? 1 : 0;
  const upvoters = userVote === 'up' ? [currentUserName] : [];
  const downvoters = userVote === 'down' ? [currentUserName] : [];

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
        userVote={userVote}
        upvotes={upvotes}
        upvoters={upvoters}
        downvotes={downvotes}
        downvoters={downvoters}
        onUpvote={() => handleVote('up')}
        onDownvote={() => handleVote('down')}
      />
    </div>
  );
}
