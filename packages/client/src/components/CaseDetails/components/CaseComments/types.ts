export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; firstName: string; lastName: string; email: string };
      reactions?: Array<{
        id: string;
        reactionType: 'LIKE' | 'DISLIKE';
        userId: string;
        user: { id: string; firstName: string; lastName: string };
      }>;
    }>;
  };
};
