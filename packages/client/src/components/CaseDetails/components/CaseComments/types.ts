export type VoteType = 'up' | 'down';

export type CommentReaction = {
  upvotes: number;
  downvotes: number;
  userVote: VoteType | 'none';
};

export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; firstName: string; lastName: string; email: string };
    }>;
  };
};
