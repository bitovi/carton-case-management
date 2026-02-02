export interface CommentVoteButtonsProps {
  commentId: string;
  votes: Array<{
    id: string;
    userId: string;
    voteType: 'LIKE' | 'DISLIKE';
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  currentUserId: string;
}
