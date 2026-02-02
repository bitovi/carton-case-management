export interface VoteButtonsProps {
  commentId: string;
  likeCount: number;
  dislikeCount: number;
  userVote: 'LIKE' | 'DISLIKE' | null;
  likeVoters: Array<{ id: string; name: string }>;
  dislikeVoters: Array<{ id: string; name: string }>;
  onVote: (commentId: string, voteType: 'LIKE' | 'DISLIKE' | undefined) => void;
}
