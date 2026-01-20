import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export interface ReactionStatisticsProps {
  upvoteCount: number;
  downvoteCount: number;
  hasUserUpvoted?: boolean;
  hasUserDownvoted?: boolean;
  upvoters?: string[];
  downvoters?: string[];
  onUpvote?: () => void;
  onDownvote?: () => void;
}

export function ReactionStatistics({
  upvoteCount,
  downvoteCount,
  hasUserUpvoted = false,
  hasUserDownvoted = false,
  upvoters = [],
  downvoters = [],
  onUpvote,
  onDownvote,
}: ReactionStatisticsProps) {
  const [showUpvoteTooltip, setShowUpvoteTooltip] = useState(false);
  const [showDownvoteTooltip, setShowDownvoteTooltip] = useState(false);

  const hasUpvotes = upvoteCount > 0;
  const hasDownvotes = downvoteCount > 0;

  return (
    <div 
      className="flex items-center gap-4 py-1 rounded-lg" 
      data-testid="reaction-statistics"
    >
      {/* Upvote section */}
      <div 
        className="relative flex items-center gap-2" 
        data-testid="upvote-group"
        onMouseEnter={() => upvoters.length > 0 && setShowUpvoteTooltip(true)}
        onMouseLeave={() => setShowUpvoteTooltip(false)}
      >
        <ThumbsUp
          className={`size-[18px] ${
            hasUserUpvoted ? 'text-teal-500' : 'text-gray-800'
          } ${onUpvote ? 'cursor-pointer' : ''}`}
          onClick={onUpvote}
          aria-label="thumbs up"
        />
        {hasUpvotes && (
          <span 
            className={`text-sm leading-[21px] ${
              hasUserUpvoted ? 'text-teal-500' : 'text-gray-950'
            }`}
          >
            {upvoteCount}
          </span>
        )}
        
        {/* Upvote tooltip */}
        {showUpvoteTooltip && upvoters.length > 0 && (
          <div
            className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10"
            data-testid="upvote-tooltip"
          >
            {upvoters.map((name, index) => (
              <div key={index} className="p-2">
                <p className="text-sm leading-[21px] text-teal-600 font-semibold">
                  {name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Downvote section */}
      <div 
        className="relative flex items-center gap-2" 
        data-testid="downvote-group"
        onMouseEnter={() => downvoters.length > 0 && setShowDownvoteTooltip(true)}
        onMouseLeave={() => setShowDownvoteTooltip(false)}
      >
        <ThumbsDown
          className={`size-[18px] ${
            hasUserDownvoted ? 'text-teal-500' : 'text-gray-800'
          } ${onDownvote ? 'cursor-pointer' : ''}`}
          onClick={onDownvote}
          aria-label="thumbs down"
        />
        {hasDownvotes && (
          <span 
            className={`text-sm leading-[21px] ${
              hasUserDownvoted ? 'text-teal-500' : 'text-gray-950'
            }`}
          >
            {downvoteCount}
          </span>
        )}
        
        {/* Downvote tooltip */}
        {showDownvoteTooltip && downvoters.length > 0 && (
          <div
            className="absolute top-full left-0 mt-2 w-[200px] bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10"
            data-testid="downvote-tooltip"
          >
            {downvoters.map((name, index) => (
              <div key={index} className="p-2">
                <p className="text-sm leading-[21px] text-teal-600 font-semibold">
                  {name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
