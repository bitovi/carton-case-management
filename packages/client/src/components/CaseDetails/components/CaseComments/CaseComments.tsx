import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import { ReactionStatistics } from '@/components/common/ReactionStatistics';
import type { CaseCommentsProps } from './types';

export function CaseComments({ caseData }: CaseCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const utils = trpc.useUtils();

  // Fetch current user from auth
  const { data: currentUserData } = trpc.auth.me.useQuery();
  const currentUserId = currentUserData?.id;

  const createCommentMutation = trpc.comment.create.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseData.id });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseData.id });

      // Optimistically add comment to cache
      if (previousCase && currentUserData) {
        const optimisticComment = {
          id: `temp-${Date.now()}`,
          content: variables.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          caseId: caseData.id,
          authorId: currentUserData.id,
          author: {
            id: currentUserData.id,
            name: currentUserData.name,
            email: currentUserData.email,
          },
          votes: [],
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

      // Optimistically update votes in cache
      if (previousCase && currentUserId) {
        const updatedComments = previousCase.comments?.map((comment) => {
          if (comment.id === variables.commentId) {
            // Remove existing vote by current user
            const votesWithoutCurrentUser = comment.votes?.filter(
              (vote) => vote.userId !== currentUserId
            ) || [];

            // Add new vote if voteType is not null
            const newVotes = variables.voteType
              ? [
                  ...votesWithoutCurrentUser,
                  {
                    id: `temp-${Date.now()}`,
                    commentId: comment.id,
                    userId: currentUserId,
                    voteType: variables.voteType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                      id: currentUserId,
                      name: currentUserData?.name || '',
                      email: currentUserData?.email || '',
                    },
                  },
                ]
              : votesWithoutCurrentUser;

            return {
              ...comment,
              votes: newVotes,
            };
          }
          return comment;
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

  const handleVote = (commentId: string, currentUserVote: 'none' | 'up' | 'down', newVote: 'up' | 'down') => {
    // If clicking the same vote, remove it. Otherwise, set the new vote.
    const voteType = currentUserVote === newVote ? null : newVote.toUpperCase() as 'UP' | 'DOWN';
    voteMutation.mutate({ commentId, voteType });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId) return;

    createCommentMutation.mutate({
      caseId: caseData.id,
      content: newComment.trim(),
    });
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
          caseData.comments.map((comment) => {
            // Calculate vote statistics
            const upvotes = comment.votes?.filter((v) => v.voteType === 'UP') || [];
            const downvotes = comment.votes?.filter((v) => v.voteType === 'DOWN') || [];
            const userVote = comment.votes?.find((v) => v.userId === currentUserId);
            const userVoteType = userVote ? (userVote.voteType === 'UP' ? 'up' : 'down') : 'none';

            return (
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
                <ReactionStatistics
                  userVote={userVoteType}
                  upvotes={upvotes.length}
                  upvoters={upvotes.map((v) => v.user.name)}
                  downvotes={downvotes.length}
                  downvoters={downvotes.map((v) => v.user.name)}
                  onUpvote={() => handleVote(comment.id, userVoteType, 'up')}
                  onDownvote={() => handleVote(comment.id, userVoteType, 'down')}
                />
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500">No comments yet</div>
        )}
      </div>
    </div>
  );
}
