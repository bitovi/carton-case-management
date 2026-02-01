import type { VoteType } from '@carton/shared/client';

export interface Vote {
  id: string;
  voteType: VoteType;
  user: {
    id: string;
    name: string;
  };
}

export interface CommentVoteButtonsProps {
  commentId: string;
  votes: Vote[];
  currentUserId?: string;
  onVoteSuccess?: () => void;
}
