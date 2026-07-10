import { useState } from 'react';
import { VoteButton } from '@/components/common/VoteButton';
import type { CommentItemProps } from './types';

type VoteType = 'like' | 'dislike' | null;

type VoteState = {
  likeVoters: string[];
  dislikeVoters: string[];
  currentVote: VoteType;
};

export function CommentItem({ comment, currentUserName }: CommentItemProps) {
  const [voteState, setVoteState] = useState<VoteState>({
    likeVoters: [],
    dislikeVoters: [],
    currentVote: null,
  });

  const handleVote = (type: 'like' | 'dislike') => {
    if (!currentUserName) return;

    setVoteState((prev) => {
      const sameType = prev.currentVote === type;

      if (sameType) {
        const key = type === 'like' ? 'likeVoters' : 'dislikeVoters';
        return {
          ...prev,
          [key]: prev[key].filter((name) => name !== currentUserName),
          currentVote: null,
        };
      }

      const addKey = type === 'like' ? 'likeVoters' : 'dislikeVoters';
      const removeKey = type === 'like' ? 'dislikeVoters' : 'likeVoters';

      return {
        likeVoters: addKey === 'likeVoters'
          ? [...prev.likeVoters, currentUserName]
          : prev.likeVoters.filter((name) => name !== currentUserName),
        dislikeVoters: removeKey === 'dislikeVoters'
          ? prev.dislikeVoters.filter((name) => name !== currentUserName)
          : [...prev.dislikeVoters, currentUserName],
        currentVote: type,
      };
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
      <div className="flex items-center gap-3 mt-1">
        <VoteButton
          type="up"
          count={voteState.likeVoters.length}
          voters={voteState.likeVoters}
          active={voteState.currentVote === 'like'}
          onClick={() => handleVote('like')}
        />
        <VoteButton
          type="down"
          count={voteState.dislikeVoters.length}
          voters={voteState.dislikeVoters}
          active={voteState.currentVote === 'dislike'}
          onClick={() => handleVote('dislike')}
        />
      </div>
    </div>
  );
}
