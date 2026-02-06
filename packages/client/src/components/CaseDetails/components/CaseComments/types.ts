export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; name: string; email: string };
      votes?: Array<{
        id: string;
        userId: string;
        voteType: 'LIKE' | 'DISLIKE';
        user: { id: string; name: string; email: string };
      }>;
    }>;
  };
};
