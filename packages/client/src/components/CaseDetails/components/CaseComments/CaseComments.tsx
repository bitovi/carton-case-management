import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CaseCommentsProps } from './types';

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
          votes: [],
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

  const voteCommentMutation = trpc.comment.vote.useMutation({
    onMutate: async ({ commentId, type }) => {
      if (!currentUser) {
        return;
      }

      await utils.case.getById.cancel({ id: caseData.id });
      const previousCase = utils.case.getById.getData({ id: caseData.id });

      if (!previousCase?.comments) {
        return { previousCase };
      }

      const updatedComments = previousCase.comments.map((comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        const existingVote = comment.votes?.find((vote) => vote.user.id === currentUser.id);
        let nextVotes = comment.votes ? [...comment.votes] : [];

        if (existingVote?.type === type) {
          nextVotes = nextVotes.filter((vote) => vote.user.id !== currentUser.id);
        } else if (existingVote) {
          nextVotes = nextVotes.map((vote) =>
            vote.user.id === currentUser.id ? { ...vote, type } : vote
          );
        } else {
          nextVotes.push({
            id: `temp-vote-${Date.now()}`,
            type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            commentId,
            userId: currentUser.id,
            user: {
              id: currentUser.id,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
            },
          });
        }

        return {
          ...comment,
          votes: nextVotes,
        };
      });

      utils.case.getById.setData(
        { id: caseData.id },
        {
          ...previousCase,
          comments: updatedComments,
        }
      );

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseData.id }, context.previousCase);
      }
    },
    onSettled: () => {
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
              <ReactionStatistics
                userVote={
                  comment.votes?.find((vote) => vote.user.id === currentUser?.id)?.type === 'UP'
                    ? 'up'
                    : comment.votes?.find((vote) => vote.user.id === currentUser?.id)?.type === 'DOWN'
                      ? 'down'
                      : 'none'
                }
                upvotes={comment.votes?.filter((vote) => vote.type === 'UP').length ?? 0}
                downvotes={comment.votes?.filter((vote) => vote.type === 'DOWN').length ?? 0}
                upvoters={
                  comment.votes
                    ?.filter((vote) => vote.type === 'UP')
                    .map((vote) => `${vote.user.firstName} ${vote.user.lastName}`) ?? []
                }
                downvoters={
                  comment.votes
                    ?.filter((vote) => vote.type === 'DOWN')
                    .map((vote) => `${vote.user.firstName} ${vote.user.lastName}`) ?? []
                }
                isPending={voteCommentMutation.isPending}
                onUpvote={() => voteCommentMutation.mutate({ commentId: comment.id, type: 'UP' })}
                onDownvote={() => voteCommentMutation.mutate({ commentId: comment.id, type: 'DOWN' })}
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
