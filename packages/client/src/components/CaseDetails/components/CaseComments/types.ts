export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; firstName: string; lastName: string; email: string };
      voteStats?: {
        upvotes: number;
        downvotes: number;
        upvoters: Array<{ id: string; name: string }>;
        downvoters: Array<{ id: string; name: string }>;
        userVote: 'none' | 'up' | 'down';
      };
    }>;
  };
};
