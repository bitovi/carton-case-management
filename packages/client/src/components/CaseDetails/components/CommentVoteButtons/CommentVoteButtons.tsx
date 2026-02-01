import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { VoteButton } from '@/components/common/VoteButton';
import type { CommentVoteButtonsProps } from './types';

export function CommentVoteButtons({
  commentId,
  votes,
  currentUserId,
  onVoteSuccess,
}: CommentVoteButtonsProps) {
  const voteToggleMutation = trpc.vote.toggle.useMutation({
    onSuccess: () => {
      // Invalidate the case query to refresh vote counts
      onVoteSuccess?.();
    },
  });

  // Calculate vote statistics
  const voteStats = useMemo(() => {
    const likes = votes.filter((v) => v.voteType === 'LIKE');
    const dislikes = votes.filter((v) => v.voteType === 'DISLIKE');

    const userVote = currentUserId
      ? votes.find((v) => v.user.id === currentUserId)
      : undefined;

    return {
      likeCount: likes.length,
      dislikeCount: dislikes.length,
      likeVoters: likes.map((v) => v.user.name),
      dislikeVoters: dislikes.map((v) => v.user.name),
      userLiked: userVote?.voteType === 'LIKE',
      userDisliked: userVote?.voteType === 'DISLIKE',
    };
  }, [votes, currentUserId]);

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    voteToggleMutation.mutate({
      commentId,
      voteType,
    });
  };

  return (
    <div className="flex items-center gap-4">
      <VoteButton
        type="up"
        active={voteStats.userLiked}
        count={voteStats.likeCount}
        showCount={voteStats.likeCount > 0}
        voters={voteStats.likeVoters}
        onClick={() => handleVote('LIKE')}
      />
      <VoteButton
        type="down"
        active={voteStats.userDisliked}
        count={voteStats.dislikeCount}
        showCount={voteStats.dislikeCount > 0}
        voters={voteStats.dislikeVoters}
        onClick={() => handleVote('DISLIKE')}
      />
    </div>
  );
}
