export type CommentAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
};

export type CommentsProps = {
  comments: CommentItem[];
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
};
