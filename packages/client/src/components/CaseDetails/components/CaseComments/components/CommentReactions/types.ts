export type ReactionType = 'LIKE' | 'DISLIKE';

export type CommentReactionItem = {
  id: string;
  type: ReactionType;
  userId: string;
};

export interface CommentReactionsProps {
  reactions: CommentReactionItem[];
  currentUserId?: string;
  onReact: (type: ReactionType) => void;
  disabled?: boolean;
}
