import { ThumbsUp, ThumbsDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/obra';
import type { VoteButtonsProps } from './types';

export function VoteButtons({
  commentId,
  likeCount,
  dislikeCount,
  userVote,
  likeVoters,
  dislikeVoters,
  onVote,
}: VoteButtonsProps) {
  const handleLikeClick = () => {
    if (userVote === 'LIKE') {
      // Remove like
      onVote(commentId, undefined);
    } else {
      // Add or change to like
      onVote(commentId, 'LIKE');
    }
  };

  const handleDislikeClick = () => {
    if (userVote === 'DISLIKE') {
      // Remove dislike
      onVote(commentId, undefined);
    } else {
      // Add or change to dislike
      onVote(commentId, 'DISLIKE');
    }
  };

  const hasLikes = likeCount > 0;
  const hasDislikes = dislikeCount > 0;

  return (
    <div className="flex items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleLikeClick}
              className="flex items-center gap-1.5 group"
              aria-label={userVote === 'LIKE' ? 'Remove like' : 'Like comment'}
            >
              <ThumbsUp
                className={`w-4 h-4 transition-colors ${
                  userVote === 'LIKE'
                    ? 'fill-teal-600 text-teal-600'
                    : 'text-gray-400 group-hover:text-teal-600'
                }`}
              />
              {hasLikes && (
                <span
                  className={`text-sm ${
                    userVote === 'LIKE' ? 'text-teal-600' : 'text-gray-500'
                  }`}
                >
                  {likeCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          {hasLikes && (
            <TooltipContent>
              <div className="text-xs">
                <p className="font-semibold mb-1">Liked by:</p>
                {likeVoters.map((voter) => (
                  <p key={voter.id}>{voter.name}</p>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleDislikeClick}
              className="flex items-center gap-1.5 group"
              aria-label={
                userVote === 'DISLIKE' ? 'Remove dislike' : 'Dislike comment'
              }
            >
              <ThumbsDown
                className={`w-4 h-4 transition-colors ${
                  userVote === 'DISLIKE'
                    ? 'fill-teal-600 text-teal-600'
                    : 'text-gray-400 group-hover:text-teal-600'
                }`}
              />
              {hasDislikes && (
                <span
                  className={`text-sm ${
                    userVote === 'DISLIKE' ? 'text-teal-600' : 'text-gray-500'
                  }`}
                >
                  {dislikeCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          {hasDislikes && (
            <TooltipContent>
              <div className="text-xs">
                <p className="font-semibold mb-1">Disliked by:</p>
                {dislikeVoters.map((voter) => (
                  <p key={voter.id}>{voter.name}</p>
                ))}
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
