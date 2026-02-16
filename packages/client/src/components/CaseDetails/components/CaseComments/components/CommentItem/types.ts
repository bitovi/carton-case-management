export interface CommentItemProps {
  /**
   * Comment data
   */
  comment: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
    };
  };
}
