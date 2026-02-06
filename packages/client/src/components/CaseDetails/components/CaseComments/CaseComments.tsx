import { useState } from 'react';
import type { FormEvent } from 'react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/obra';
import { VoteButton } from '@/components/common/VoteButton';
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
            name: currentUser.name,
            email: currentUser.email,
          },
          // New comments start with no votes
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

  const toggleVoteMutation = trpc.vote.toggle.useMutation({
    onSuccess: () => {
      // Refetch case to update vote counts
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

  const handleVote = (commentId: string, voteType: 'LIKE' | 'DISLIKE') => {
    toggleVoteMutation.mutate({
      commentId,
      voteType,
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
            // Calculate vote counts and determine user's vote
            const votes = comment.votes || [];
            const likeVotes = votes.filter((v) => v.voteType === 'LIKE');
            const dislikeVotes = votes.filter((v) => v.voteType === 'DISLIKE');
            const likeCount = likeVotes.length;
            const dislikeCount = dislikeVotes.length;
            
            const userVote = currentUser
              ? votes.find((v) => v.userId === currentUser.id)
              : undefined;
            const hasLiked = userVote?.voteType === 'LIKE';
            const hasDisliked = userVote?.voteType === 'DISLIKE';

            // Get voter names for tooltips
            const likeVoters = likeVotes.map((v) => v.user.name);
            const dislikeVoters = dislikeVotes.map((v) => v.user.name);

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
                <div className="flex gap-4 items-center">
                  <VoteButton
                    type="up"
                    active={hasLiked}
                    count={likeCount}
                    showCount={likeCount > 0}
                    voters={likeVoters}
                    onClick={() => handleVote(comment.id, 'LIKE')}
                  />
                  <VoteButton
                    type="down"
                    active={hasDisliked}
                    count={dislikeCount}
                    showCount={dislikeCount > 0}
                    voters={dislikeVoters}
                    onClick={() => handleVote(comment.id, 'DISLIKE')}
                  />
                </div>
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
