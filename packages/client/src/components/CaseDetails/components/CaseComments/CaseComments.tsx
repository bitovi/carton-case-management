import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import type { VoteType } from '@carton/shared/client';
import type { CaseCommentsProps } from './types';
import { CommentVoteButtons } from './components/CommentVoteButtons';

export function CaseComments({ caseData }: CaseCommentsProps) {
  const [newComment, setNewComment] = useState('');
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
            name: currentUser.name,
            email: currentUser.email,
          },
          likesCount: 0,
          dislikesCount: 0,
          currentUserVote: undefined,
          likeVoters: [],
          dislikeVoters: [],
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

  const voteMutation = trpc.comment.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseData.id });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseData.id });

      // Optimistically update vote counts
      if (previousCase && currentUser) {
        const updatedComments = previousCase.comments?.map((comment) => {
          if (comment.id !== variables.commentId) return comment;

          const currentVote = comment.currentUserVote;
          let likesCount = comment.likesCount || 0;
          let dislikesCount = comment.dislikesCount || 0;
          let likeVoters = [...(comment.likeVoters || [])];
          let dislikeVoters = [...(comment.dislikeVoters || [])];
          let newVote: VoteType | undefined = undefined;

          // Remove from current vote lists
          if (currentVote === 'LIKE') {
            likesCount--;
            likeVoters = likeVoters.filter((v) => v.id !== currentUser.id);
          } else if (currentVote === 'DISLIKE') {
            dislikesCount--;
            dislikeVoters = dislikeVoters.filter((v) => v.id !== currentUser.id);
          }

          // If clicking the same vote, just remove it (already done above)
          // If clicking different vote, add to new list
          if (currentVote !== variables.voteType) {
            newVote = variables.voteType;
            if (variables.voteType === 'LIKE') {
              likesCount++;
              likeVoters = [...likeVoters, { id: currentUser.id, name: currentUser.name }];
            } else {
              dislikesCount++;
              dislikeVoters = [...dislikeVoters, { id: currentUser.id, name: currentUser.name }];
            }
          }

          return {
            ...comment,
            likesCount,
            dislikesCount,
            currentUserVote: newVote,
            likeVoters,
            dislikeVoters,
          };
        });

        utils.case.getById.setData(
          { id: caseData.id },
          {
            ...previousCase,
            comments: updatedComments,
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

  const handleVote = (commentId: string, voteType: VoteType) => {
    voteMutation.mutate({ commentId, voteType });
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-1 lg:min-h-0">
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
      <div className="flex flex-col gap-4 md:overflow-y-auto md:flex-1 md:min-h-0">
        {caseData.comments && caseData.comments.length > 0 ? (
          caseData.comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 py-2">
              <div className="flex gap-2 items-center">
                <div className="w-10 flex items-center justify-center text-sm font-semibold text-gray-900">
                  {comment.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{comment.author.name}</p>
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
              <CommentVoteButtons
                commentId={comment.id}
                likesCount={comment.likesCount || 0}
                dislikesCount={comment.dislikesCount || 0}
                currentUserVote={comment.currentUserVote}
                likeVoters={comment.likeVoters || []}
                dislikeVoters={comment.dislikeVoters || []}
                onVote={handleVote}
                disabled={voteMutation.isPending}
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
