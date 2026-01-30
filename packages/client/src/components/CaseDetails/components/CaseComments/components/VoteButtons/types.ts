export type VoteButtonsProps = {
  commentId: string;
  votes?: Array<{
    id: string;
    voteType: 'LIKE' | 'DISLIKE';
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  currentUserId?: string;
  onVote?: (commentId: string, voteType: 'LIKE' | 'DISLIKE') => void;
};
