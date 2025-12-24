import { CommentItem } from './CommentItem';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CommentsListProps {
  comments: Comment[];
}

export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Comments</h2>
        <p className="text-sm text-gray-500 py-8">
          No comments yet. Be the first to add a comment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Comments ({comments.length})
      </h2>
      <div className="space-y-1">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            content={comment.content}
            authorName={comment.author.name}
            authorEmail={comment.author.email}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
