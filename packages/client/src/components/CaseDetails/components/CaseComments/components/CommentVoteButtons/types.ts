import type { VoteType } from '@carton/shared/client';

export interface CommentVoteButtonsProps {
  commentId: string;
  likesCount: number;
  dislikesCount: number;
  currentUserVote?: VoteType;
  likeVoters: Array<{ id: string; name: string }>;
  dislikeVoters: Array<{ id: string; name: string }>;
  onVote: (commentId: string, voteType: VoteType) => void;
  disabled?: boolean;
}
