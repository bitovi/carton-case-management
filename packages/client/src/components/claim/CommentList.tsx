import { CommentItem } from './CommentItem';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: Date | string;
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet. Be the first to add a comment.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-200 px-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            content={comment.content}
            authorName={comment.author.name}
            createdAt={comment.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
