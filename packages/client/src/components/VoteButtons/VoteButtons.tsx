import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/obra/Button';
import { trpc } from '@/lib/trpc';
import type { VoteSummary, VoteType } from '@carton/shared';

export interface VoteButtonsProps {
  caseId: string;
  voteSummary: VoteSummary;
  disabled?: boolean;
}

export function VoteButtons({ caseId, voteSummary, disabled = false }: VoteButtonsProps) {
  const utils = trpc.useUtils();
  
  const voteMutation = trpc.case.vote.useMutation({
    // Optimistic update
    onMutate: async ({ caseId, voteType }) => {
      // Cancel outgoing refetches
      await utils.case.getById.cancel({ id: caseId });
      await utils.case.list.cancel();

      // Snapshot the previous values
      const previousCase = utils.case.getById.getData({ id: caseId });
      const previousList = utils.case.list.getData();

      // Calculate optimistic vote summary
      const calculateOptimisticSummary = (
        currentSummary: VoteSummary,
        newVoteType: VoteType
      ): VoteSummary => {
        let likes = currentSummary.likes;
        let dislikes = currentSummary.dislikes;
        const currentUserVote = currentSummary.userVote;

        // Remove previous vote if exists
        if (currentUserVote === 'LIKE') {
          likes--;
        } else if (currentUserVote === 'DISLIKE') {
          dislikes--;
        }

        // Add new vote or toggle off
        if (currentUserVote === newVoteType) {
          // Toggling off - already removed above
          return { likes, dislikes, userVote: null };
        } else {
          // Adding new vote
          if (newVoteType === 'LIKE') {
            likes++;
          } else {
            dislikes++;
          }
          return { likes, dislikes, userVote: newVoteType };
        }
      };

      const optimisticSummary = calculateOptimisticSummary(voteSummary, voteType);

      // Optimistically update case details
      if (previousCase) {
        utils.case.getById.setData({ id: caseId }, {
          ...previousCase,
          voteSummary: optimisticSummary,
        });
      }

      // Optimistically update case list
      if (previousList) {
        utils.case.list.setData(undefined, previousList.map((c) =>
          c.id === caseId ? { ...c, voteSummary: optimisticSummary } : c
        ));
      }

      return { previousCase, previousList };
    },
    // Rollback on error
    onError: (err, { caseId }, context) => {
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      if (context?.previousList) {
        utils.case.list.setData(undefined, context.previousList);
      }
    },
    // Refetch on settle
    onSettled: (_data, _error, { caseId }) => {
      utils.case.getById.invalidate({ id: caseId });
      utils.case.list.invalidate();
    },
  });

  const handleVote = (voteType: VoteType) => {
    voteMutation.mutate({ caseId, voteType });
  };

  const isLiked = voteSummary.userVote === 'LIKE';
  const isDisliked = voteSummary.userVote === 'DISLIKE';

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => handleVote('LIKE')}
        disabled={disabled || voteMutation.isPending}
        variant={isLiked ? 'default' : 'outline'}
        size="small"
        className={`flex items-center gap-1 ${
          isLiked ? 'bg-green-600 hover:bg-green-700 text-white' : ''
        }`}
        aria-label={isLiked ? 'Remove like' : 'Like this case'}
        aria-pressed={isLiked}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{voteSummary.likes}</span>
      </Button>
      <Button
        onClick={() => handleVote('DISLIKE')}
        disabled={disabled || voteMutation.isPending}
        variant={isDisliked ? 'default' : 'outline'}
        size="small"
        className={`flex items-center gap-1 ${
          isDisliked ? 'bg-red-600 hover:bg-red-700 text-white' : ''
        }`}
        aria-label={isDisliked ? 'Remove dislike' : 'Dislike this case'}
        aria-pressed={isDisliked}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{voteSummary.dislikes}</span>
      </Button>
    </div>
  );
}
