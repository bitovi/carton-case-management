export type CommentItemComment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; firstName: string; lastName: string; email: string };
};

export type CommentItemProps = {
  comment: CommentItemComment;
  currentUserName: string | null;
};
