import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/obra';
import type { CommentVoteButtonsProps } from './types';

export function CommentVoteButtons({
  commentId,
  votes,
  currentUserId,
  onVote,
  onRemoveVote,
}: CommentVoteButtonsProps) {
  // Calculate vote counts and user's vote
  const likeVotes = votes.filter((v) => v.voteType === 'LIKE');
  const dislikeVotes = votes.filter((v) => v.voteType === 'DISLIKE');
  const likeCount = likeVotes.length;
  const dislikeCount = dislikeVotes.length;

  const userVote = currentUserId
    ? votes.find((v) => v.userId === currentUserId)
    : undefined;
  const hasLiked = userVote?.voteType === 'LIKE';
  const hasDisliked = userVote?.voteType === 'DISLIKE';

  // Get names of users who voted
  const likeNames = likeVotes.map((v) => v.user.name).join(', ');
  const dislikeNames = dislikeVotes.map((v) => v.user.name).join(', ');

  const handleLikeClick = () => {
    if (hasLiked && onRemoveVote) {
      onRemoveVote(commentId);
    } else if (onVote) {
      onVote(commentId, 'LIKE');
    }
  };

  const handleDislikeClick = () => {
    if (hasDisliked && onRemoveVote) {
      onRemoveVote(commentId);
    } else if (onVote) {
      onVote(commentId, 'DISLIKE');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="small"
              onClick={handleLikeClick}
              className="flex items-center gap-1 h-8 px-2 hover:bg-gray-100"
            >
              <ThumbsUp
                className={`w-4 h-4 ${hasLiked ? 'fill-teal-600 text-teal-600' : 'text-gray-600'}`}
              />
              {likeCount > 0 && (
                <span className={`text-sm ${hasLiked ? 'text-teal-600' : 'text-gray-600'}`}>
                  {likeCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {likeCount > 0 ? likeNames : 'Like'}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="small"
              onClick={handleDislikeClick}
              className="flex items-center gap-1 h-8 px-2 hover:bg-gray-100"
            >
              <ThumbsDown
                className={`w-4 h-4 ${hasDisliked ? 'fill-teal-600 text-teal-600' : 'text-gray-600'}`}
              />
              {dislikeCount > 0 && (
                <span className={`text-sm ${hasDisliked ? 'text-teal-600' : 'text-gray-600'}`}>
                  {dislikeCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {dislikeCount > 0 ? dislikeNames : 'Dislike'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
