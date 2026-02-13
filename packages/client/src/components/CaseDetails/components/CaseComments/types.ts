export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; firstName: string; lastName: string; email: string };
      votes?: Array<{
        id: string;
        commentId: string;
        userId: string;
        voteType: 'UP' | 'DOWN';
        createdAt: string;
        updatedAt: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
        };
      }>;
    }>;
  };
};
