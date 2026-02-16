export interface CommentReaction {
  id: string;
  type: 'LIKE' | 'DISLIKE';
  userId: string;
}

export interface CommentReactionsProps {
  /** Comment ID for the reactions */
  commentId: string;
  
  /** Array of all reactions on this comment */
  reactions: CommentReaction[];
  
  /** Current user ID to determine if they've voted */
  currentUserId?: string;
  
  /** Handler for reaction toggle */
  onReactionToggle: (type: 'LIKE' | 'DISLIKE') => void;
  
  /** Whether the mutation is in progress */
  isLoading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}
