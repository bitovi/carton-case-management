/**
 * Custom hook for managing comment voting functionality
 *
 * Provides like/dislike voting functionality with optimistic updates,
 * error handling, and vote count aggregation.
 *
 * @module useCommentVoting
 */

import { useMemo, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import type { VoteType } from '@carton/shared';

export interface CommentWithVotes {
  id: string;
  votes?: Array<{
    id: string;
    voteType: string;
    userId: string;
    createdAt: Date | string;
  }>;
}

export interface VoteData {
  likes: number;
  dislikes: number;
  userVote: VoteType | null;
}

/**
 * Hook for managing voting on a comment
 *
 * @param comment - The comment object with votes
 * @param currentUserId - The ID of the currently authenticated user
 * @param caseId - The ID of the case (for cache invalidation)
 * @returns Vote data and handlers
 */
export function useCommentVoting(
  comment: CommentWithVotes,
  currentUserId: string | undefined,
  caseId: string
) {
  const utils = trpc.useUtils();

  // Calculate vote counts and current user's vote
  const voteData: VoteData = useMemo(() => {
    const votes = comment.votes || [];
    const likes = votes.filter((v) => v.voteType === 'LIKE').length;
    const dislikes = votes.filter((v) => v.voteType === 'DISLIKE').length;
    const userVote = currentUserId
      ? (votes.find((v) => v.userId === currentUserId)?.voteType as VoteType) || null
      : null;

    return { likes, dislikes, userVote };
  }, [comment.votes, currentUserId]);

  // Vote mutation
  const voteMutation = trpc.commentVote.vote.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update the cache
      if (previousCase && currentUserId) {
        utils.case.getById.setData({ id: caseId }, {
          ...previousCase,
          comments: previousCase.comments?.map((c) => {
            if (c.id === comment.id) {
              const existingVotes = c.votes || [];
              const otherVotes = existingVotes.filter((v) => v.userId !== currentUserId);
              
              return {
                ...c,
                votes: [
                  ...otherVotes,
                  {
                    id: `temp-${Date.now()}`,
                    voteType: variables.voteType,
                    userId: currentUserId,
                    createdAt: new Date().toISOString(),
                  },
                ],
              };
            }
            return c;
          }),
        });
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  // Remove vote mutation
  const removeVoteMutation = trpc.commentVote.removeVote.useMutation({
    onMutate: async () => {
      // Cancel outgoing queries
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update the cache
      if (previousCase && currentUserId) {
        utils.case.getById.setData({ id: caseId }, {
          ...previousCase,
          comments: previousCase.comments?.map((c) => {
            if (c.id === comment.id) {
              return {
                ...c,
                votes: (c.votes || []).filter((v) => v.userId !== currentUserId),
              };
            }
            return c;
          }),
        });
      }

      return { previousCase };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      utils.case.getById.invalidate({ id: caseId });
    },
  });

  /**
   * Handle like button click
   * - If no vote: create LIKE vote
   * - If already LIKE: remove vote
   * - If DISLIKE: change to LIKE
   */
  const handleLike = useCallback(() => {
    if (!currentUserId) return;

    if (voteData.userVote === 'LIKE') {
      // Remove vote
      removeVoteMutation.mutate({ commentId: comment.id });
    } else {
      // Create or update to LIKE
      voteMutation.mutate({ commentId: comment.id, voteType: 'LIKE' });
    }
  }, [currentUserId, voteData.userVote, comment.id, voteMutation, removeVoteMutation]);

  /**
   * Handle dislike button click
   * - If no vote: create DISLIKE vote
   * - If already DISLIKE: remove vote
   * - If LIKE: change to DISLIKE
   */
  const handleDislike = useCallback(() => {
    if (!currentUserId) return;

    if (voteData.userVote === 'DISLIKE') {
      // Remove vote
      removeVoteMutation.mutate({ commentId: comment.id });
    } else {
      // Create or update to DISLIKE
      voteMutation.mutate({ commentId: comment.id, voteType: 'DISLIKE' });
    }
  }, [currentUserId, voteData.userVote, comment.id, voteMutation, removeVoteMutation]);

  return {
    voteData,
    handleLike,
    handleDislike,
    isLoading: voteMutation.isPending || removeVoteMutation.isPending,
    error: voteMutation.error || removeVoteMutation.error,
  };
}
