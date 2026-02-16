import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { VoteButton } from '@/components/common/VoteButton';
import type { CommentReactionsProps } from './types';

export function CommentReactions({
  commentId,
  reactions,
  currentUserId,
  onReactionToggle,
  isLoading = false,
  className,
}: CommentReactionsProps) {
  // Calculate counts and check if current user has reacted
  const reactionData = useMemo(() => {
    const likeCount = reactions.filter((r) => r.type === 'LIKE').length;
    const dislikeCount = reactions.filter((r) => r.type === 'DISLIKE').length;
    const userReaction = currentUserId
      ? reactions.find((r) => r.userId === currentUserId)
      : undefined;
    
    return {
      likeCount,
      dislikeCount,
      hasLiked: userReaction?.type === 'LIKE',
      hasDisliked: userReaction?.type === 'DISLIKE',
    };
  }, [reactions, currentUserId]);

  const handleLikeClick = () => {
    if (!isLoading) {
      onReactionToggle('LIKE');
    }
  };

  const handleDislikeClick = () => {
    if (!isLoading) {
      onReactionToggle('DISLIKE');
    }
  };

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      data-comment-id={commentId}
    >
      <VoteButton
        type="up"
        active={reactionData.hasLiked}
        count={reactionData.likeCount}
        showCount={true}
        onClick={handleLikeClick}
        aria-disabled={isLoading || !currentUserId}
      />
      <VoteButton
        type="down"
        active={reactionData.hasDisliked}
        count={reactionData.dislikeCount}
        showCount={true}
        onClick={handleDislikeClick}
        aria-disabled={isLoading || !currentUserId}
      />
    </div>
  );
}
