import type { VoteType } from '@carton/shared/client';

export interface CommentVoteButtonProps {
  commentId: string;
  likeCount: number;
  dislikeCount: number;
  userVote: VoteType | null;
  likeVoters: Array<{ id: string; name: string; email: string }>;
  dislikeVoters: Array<{ id: string; name: string; email: string }>;
  onVoteChange?: () => void;
}
