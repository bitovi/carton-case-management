import { useState } from 'react';
import type { FormEvent } from 'react';
import { Textarea } from '@/components/obra';
import type { CommentsProps } from './types';

export function Comments({ comments, onSubmit, isSubmitting }: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmit(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Comments</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] resize-none"
          placeholder="Add a comment..."
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="flex flex-col gap-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 py-2">
              <div className="flex gap-2 items-center">
                <div className="w-10 flex items-center justify-center text-sm font-semibold text-gray-900">
                  {comment.author.firstName[0]}{comment.author.lastName[0]}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{comment.author.firstName} {comment.author.lastName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
