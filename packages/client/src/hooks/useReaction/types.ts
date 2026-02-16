export interface UseReactionParams {
  /**
   * Type of entity to react to (CASE or COMMENT)
   */
  entityType: 'CASE' | 'COMMENT';
  
  /**
   * ID of the entity (case ID or comment ID)
   */
  entityId: string;
}

export interface UseReactionReturn {
  /**
   * Number of upvotes
   */
  upvotes: number;
  
  /**
   * Number of downvotes
   */
  downvotes: number;
  
  /**
   * Array of upvoter names
   */
  upvoters: string[];
  
  /**
   * Array of downvoter names
   */
  downvoters: string[];
  
  /**
   * Current user's vote state ('up', 'down', or 'none')
   */
  userVote: 'up' | 'down' | 'none';
  
  /**
   * Function to toggle upvote
   */
  toggleUpvote: () => void;
  
  /**
   * Function to toggle downvote
   */
  toggleDownvote: () => void;
  
  /**
   * Whether data is loading
   */
  isLoading: boolean;
  
  /**
   * Whether a mutation is in progress
   */
  isMutating: boolean;
}
