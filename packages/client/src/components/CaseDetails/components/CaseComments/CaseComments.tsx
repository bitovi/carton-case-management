import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import { ReactionStatistics } from '@/components/common';
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
          author: {
            id: currentUser.id,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
          },
          reactions: [],
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

  const toggleReactionMutation = trpc.comment.toggleReaction.useMutation({
    onMutate: async (variables) => {
      await utils.case.getById.cancel({ id: caseData.id });

      const previousCase = utils.case.getById.getData({ id: caseData.id });

      if (previousCase && currentUser) {
        utils.case.getById.setData(
          { id: caseData.id },
          {
            ...previousCase,
            comments: (previousCase.comments || []).map((comment) => {
              if (comment.id !== variables.commentId) {
                return comment;
              }

              const currentReaction = comment.reactions?.find(
                (reaction) => reaction.userId === currentUser.id
              );
              const nextReactionType = variables.type === 'up' ? 'LIKE' : 'DISLIKE';

              let nextReactions = comment.reactions || [];

              if (currentReaction?.reactionType === nextReactionType) {
                nextReactions = nextReactions.filter((reaction) => reaction.id !== currentReaction.id);
              } else if (currentReaction) {
                nextReactions = nextReactions.map((reaction) =>
                  reaction.id === currentReaction.id
                    ? { ...reaction, reactionType: nextReactionType }
                    : reaction
                );
              } else {
                nextReactions = [
                  ...nextReactions,
                  {
                    id: `temp-reaction-${Date.now()}`,
                    commentId: comment.id,
                    userId: currentUser.id,
                    reactionType: nextReactionType,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    user: {
                      id: currentUser.id,
                      firstName: currentUser.firstName,
                      lastName: currentUser.lastName,
                    },
                  },
                ];
              }

              return {
                ...comment,
                reactions: nextReactions,
              };
            }),
          }
        );
      }

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

  const getReactionDetails = (comment: NonNullable<CaseCommentsProps['caseData']['comments']>[number]) => {
    const reactions = comment.reactions || [];
    const upvoters = reactions
      .filter((reaction) => reaction.reactionType === 'LIKE')
      .map((reaction) => `${reaction.user.firstName} ${reaction.user.lastName}`);
    const downvoters = reactions
      .filter((reaction) => reaction.reactionType === 'DISLIKE')
      .map((reaction) => `${reaction.user.firstName} ${reaction.user.lastName}`);
    const userReaction = reactions.find((reaction) => reaction.userId === currentUser?.id)?.reactionType;

    return {
      upvotes: upvoters.length,
      downvotes: downvoters.length,
      upvoters,
      downvoters,
      userVote: userReaction === 'LIKE' ? 'up' : userReaction === 'DISLIKE' ? 'down' : 'none',
    } as const;
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
                {...getReactionDetails(comment)}
                isPending={toggleReactionMutation.isPending}
                onUpvote={() => {
                  toggleReactionMutation.mutate({ commentId: comment.id, type: 'up' });
                }}
                onDownvote={() => {
                  toggleReactionMutation.mutate({ commentId: comment.id, type: 'down' });
                }}
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
