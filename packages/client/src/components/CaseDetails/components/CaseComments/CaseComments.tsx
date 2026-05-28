import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { VoteButton } from '@/components/common';
import { Textarea } from '@/components/obra';
import type { CaseCommentsProps, VoteType, CommentReaction } from './types';

const DEFAULT_REACTION: CommentReaction = {
  upvotes: 0,
  downvotes: 0,
  userVote: 'none',
};

function calculateNextReaction(current: CommentReaction, voteType: VoteType): CommentReaction {
  const next = { ...current };

  if (current.userVote === voteType) {
    next.userVote = 'none';
    if (voteType === 'up') {
      next.upvotes = Math.max(0, current.upvotes - 1);
    } else {
      next.downvotes = Math.max(0, current.downvotes - 1);
    }
    return next;
  }

  if (voteType === 'up') {
    next.userVote = 'up';
    next.upvotes = current.upvotes + 1;
    if (current.userVote === 'down') {
      next.downvotes = Math.max(0, current.downvotes - 1);
    }
    return next;
  }

  next.userVote = 'down';
  next.downvotes = current.downvotes + 1;
  if (current.userVote === 'up') {
    next.upvotes = Math.max(0, current.upvotes - 1);
  }
  return next;
}

export function CaseComments({ caseData }: CaseCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState<Record<string, CommentReaction>>({});
  const utils = trpc.useUtils();

  // Fetch first user to use as current user (in production this would come from auth)
  const { data: users } = trpc.user.list.useQuery();
  const currentUser = users?.[0];

  const createCommentMutation = trpc.comment.create.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseData.id });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseData.id });

      // Optimistically add comment to cache
      if (previousCase && currentUser) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: variables.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caseId: caseData.id,
          authorId: currentUser.id,
          author: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
        };

        utils.case.getById.setData(
          { id: caseData.id },
          {
            ...previousCase,
            comments: [optimisticComment, ...(previousCase.comments || [])],
          }
        );
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseData.id }, context.previousCase);
      }
    },
    onSuccess: () => {
      // Clear input on success
      setNewComment('');
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate({ id: caseData.id });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    createCommentMutation.mutate({
      caseId: caseData.id,
      content: newComment.trim(),
    });
  };

  const getReaction = (commentId: string): CommentReaction => reactions[commentId] ?? DEFAULT_REACTION;

  const handleVote = (commentId: string, voteType: VoteType) => {
    setReactions((previous) => {
      const current = previous[commentId] ?? DEFAULT_REACTION;
      const next = calculateNextReaction(current, voteType);

      return {
        ...previous,
        [commentId]: next,
      };
    });
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
          disabled={createCommentMutation.isPending}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>
      <div className="flex flex-col gap-4">
        {caseData.comments && caseData.comments.length > 0 ? (
          caseData.comments.map((comment) => (
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
              <div className="flex items-center gap-3">
                <VoteButton
                  type="up"
                  active={getReaction(comment.id).userVote === 'up'}
                  showCount
                  count={getReaction(comment.id).upvotes}
                  onClick={() => handleVote(comment.id, 'up')}
                />
                <VoteButton
                  type="down"
                  active={getReaction(comment.id).userVote === 'down'}
                  showCount
                  count={getReaction(comment.id).downvotes}
                  onClick={() => handleVote(comment.id, 'down')}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
