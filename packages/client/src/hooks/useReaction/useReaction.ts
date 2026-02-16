import { trpc } from '@/lib/trpc';
import type { UseReactionParams, UseReactionReturn } from './types';

/**
 * Hook for managing reactions (likes/dislikes) on cases and comments
 * 
 * Provides:
 * - Current reaction statistics (up/down votes, voters)
 * - User's current vote state
 * - Toggle function for upvote/downvote with optimistic updates
 * 
 * @example
 * ```tsx
 * const { upvotes, downvotes, userVote, toggleUpvote, toggleDownvote } = useReaction({
 *   entityType: 'CASE',
 *   entityId: caseId,
 * });
 * ```
 */
export function useReaction({ entityType, entityId }: UseReactionParams): UseReactionReturn {
  const utils = trpc.useUtils();

  // Fetch reaction statistics
  const { data, isLoading } = trpc.reaction.getByEntity.useQuery({
    entityType,
    entityId,
  });

  // Mutation for toggling reactions
  const toggleMutation = trpc.reaction.toggle.useMutation({
    // Optimistic update
    onMutate: async ({ type }) => {
      // Cancel outgoing refetches
      await utils.reaction.getByEntity.cancel({ entityType, entityId });

      // Snapshot previous value
      const previousData = utils.reaction.getByEntity.getData({ entityType, entityId });

      // Optimistically update to the new value
      if (previousData) {
        const currentUserVote = previousData.userVote;
        let newUserVote: 'up' | 'down' | 'none' = 'none';
        let newUpvotes = previousData.upvotes;
        let newDownvotes = previousData.downvotes;

        if (type === 'UP') {
          if (currentUserVote === 'up') {
            // Toggling off
            newUserVote = 'none';
            newUpvotes -= 1;
          } else if (currentUserVote === 'down') {
            // Switching from down to up
            newUserVote = 'up';
            newUpvotes += 1;
            newDownvotes -= 1;
          } else {
            // Adding new upvote
            newUserVote = 'up';
            newUpvotes += 1;
          }
        } else {
          // type === 'DOWN'
          if (currentUserVote === 'down') {
            // Toggling off
            newUserVote = 'none';
            newDownvotes -= 1;
          } else if (currentUserVote === 'up') {
            // Switching from up to down
            newUserVote = 'down';
            newDownvotes += 1;
            newUpvotes -= 1;
          } else {
            // Adding new downvote
            newUserVote = 'down';
            newDownvotes += 1;
          }
        }

        utils.reaction.getByEntity.setData({ entityType, entityId }, {
          ...previousData,
          userVote: newUserVote,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        });
      }

      return { previousData };
    },
    // On error, roll back to previous value
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        utils.reaction.getByEntity.setData({ entityType, entityId }, context.previousData);
      }
    },
    // Refetch after mutation
    onSettled: () => {
      utils.reaction.getByEntity.invalidate({ entityType, entityId });
    },
  });

  const toggleUpvote = () => {
    toggleMutation.mutate({ entityType, entityId, type: 'UP' });
  };

  const toggleDownvote = () => {
    toggleMutation.mutate({ entityType, entityId, type: 'DOWN' });
  };

  return {
    upvotes: data?.upvotes ?? 0,
    downvotes: data?.downvotes ?? 0,
    upvoters: data?.upvoters ?? [],
    downvoters: data?.downvoters ?? [],
    userVote: data?.userVote ?? 'none',
    toggleUpvote,
    toggleDownvote,
    isLoading,
    isMutating: toggleMutation.isPending,
  };
}
