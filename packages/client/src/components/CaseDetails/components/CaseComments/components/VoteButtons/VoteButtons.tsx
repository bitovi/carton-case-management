import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/obra';
import type { VoteButtonsProps } from './types';

export function VoteButtons({ commentId, votes = [], currentUserId, onVote }: VoteButtonsProps) {
  // Calculate vote counts
  const likeVotes = votes.filter((v) => v.voteType === 'LIKE');
  const dislikeVotes = votes.filter((v) => v.voteType === 'DISLIKE');
  const likeCount = likeVotes.length;
  const dislikeCount = dislikeVotes.length;

  // Check if current user voted
  const userVote = votes.find((v) => v.userId === currentUserId);
  const hasLiked = userVote?.voteType === 'LIKE';
  const hasDisliked = userVote?.voteType === 'DISLIKE';

  const handleVote = (voteType: 'LIKE' | 'DISLIKE') => {
    onVote?.(commentId, voteType);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Like Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleVote('LIKE')}
            className="flex items-center gap-1 text-gray-500 hover:text-teal-600 transition-colors"
            aria-label="Like comment"
          >
            <ThumbsUp
              size={16}
              className={hasLiked ? 'fill-teal-600 text-teal-600' : ''}
            />
            {likeCount > 0 && (
              <span className={`text-sm ${hasLiked ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
                {likeCount}
              </span>
            )}
          </button>
        </TooltipTrigger>
        {likeCount > 0 && (
          <TooltipContent side="top" className="max-w-xs">
            <div className="text-sm">
              <p className="font-semibold mb-1">Liked by:</p>
              <ul className="space-y-0.5">
                {likeVotes.map((vote) => (
                  <li key={vote.id}>{vote.user.name}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Dislike Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => handleVote('DISLIKE')}
            className="flex items-center gap-1 text-gray-500 hover:text-teal-600 transition-colors"
            aria-label="Dislike comment"
          >
            <ThumbsDown
              size={16}
              className={hasDisliked ? 'fill-teal-600 text-teal-600' : ''}
            />
            {dislikeCount > 0 && (
              <span className={`text-sm ${hasDisliked ? 'text-teal-600 font-medium' : 'text-gray-600'}`}>
                {dislikeCount}
              </span>
            )}
          </button>
        </TooltipTrigger>
        {dislikeCount > 0 && (
          <TooltipContent side="top" className="max-w-xs">
            <div className="text-sm">
              <p className="font-semibold mb-1">Disliked by:</p>
              <ul className="space-y-0.5">
                {dislikeVotes.map((vote) => (
                  <li key={vote.id}>{vote.user.name}</li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
