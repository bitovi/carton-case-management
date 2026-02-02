export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; name: string; email: string };
      likeCount?: number;
      dislikeCount?: number;
      userVote?: 'LIKE' | 'DISLIKE' | null;
      likeVoters?: Array<{ id: string; name: string }>;
      dislikeVoters?: Array<{ id: string; name: string }>;
    }>;
  };
};
