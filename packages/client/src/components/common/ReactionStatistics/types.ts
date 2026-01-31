export interface ReactionStatisticsProps {
  /**
   * User's current vote state
   * @default 'none'
   * @figma Variant: UserVote
   */
  userVote?: 'none' | 'up' | 'down';
  
  /**
   * Number of upvotes
   * @default 0
   */
  upvotes?: number;
  
  /**
   * Array of upvoter names for tooltip
   */
  upvoters?: string[];
  
  /**\n   * Number of downvotes
   * @default 0
   */
  downvotes?: number;
  
  /**
   * Array of downvoter names for tooltip
   */
  downvoters?: string[];
  
  /**
   * Callback when upvote button is clicked
   */
  onUpvote?: () => void;
  
  /**
   * Callback when downvote button is clicked
   */
  onDownvote?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

