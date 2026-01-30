export type CaseCommentsProps = {
  caseData: {
    id: string;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: { id: string; name: string; email: string };
      likesCount?: number;
      dislikesCount?: number;
      currentUserVote?: 'LIKE' | 'DISLIKE';
      likeVoters?: Array<{ id: string; name: string }>;
      dislikeVoters?: Array<{ id: string; name: string }>;
    }>;
  };
};
