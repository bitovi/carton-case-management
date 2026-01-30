export interface Vote {
  id: string;
  userId: string;
  voteType: 'LIKE' | 'DISLIKE';
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommentVoteButtonsProps {
  commentId: string;
  votes: Vote[];
  currentUserId?: string;
  onVote?: (commentId: string, voteType: 'LIKE' | 'DISLIKE') => void;
  onRemoveVote?: (commentId: string) => void;
}
