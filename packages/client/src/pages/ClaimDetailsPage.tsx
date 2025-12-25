import { useParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { ClaimHeader } from '../components/claim/ClaimHeader';
import { ClaimDescription } from '../components/claim/ClaimDescription';
import { EssentialDetails } from '../components/claim/EssentialDetails';
import { CommentList } from '../components/claim/CommentList';
import { CommentInput } from '../components/claim/CommentInput';
import { ClaimSidebar } from '../components/claim/ClaimSidebar';

export function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const utils = trpc.useUtils();

  const { data: claim, error, isLoading } = trpc.getClaim.useQuery({ id: id! });
  const { data: claimsList } = trpc.getClaimsList.useQuery();

  const addCommentMutation = trpc.addComment.useMutation({
    onSuccess: () => {
      // Invalidate and refetch claim data to get the new comment
      utils.getClaim.invalidate({ id: id! });
    },
  });

  const handleCommentSubmit = (content: string) => {
    if (!id) return;
    addCommentMutation.mutate({
      caseId: id,
      content,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        {claimsList && <ClaimSidebar claims={claimsList} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading claim details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        {claimsList && <ClaimSidebar claims={claimsList} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">Error: {error.message}</div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex h-screen">
        {claimsList && <ClaimSidebar claims={claimsList} />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Claim not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {claimsList && <ClaimSidebar claims={claimsList} />}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <ClaimHeader title={claim.title} caseNumber={claim.caseNumber} status={claim.status} />

          <EssentialDetails
            customerName={claim.customerName}
            dateOpened={claim.createdAt}
            assignedAgent={claim.assignee?.name || null}
            lastUpdated={claim.updatedAt}
          />

          <ClaimDescription description={claim.description} />

          <div className="mt-6 space-y-4">
            <CommentList comments={claim.comments} />
            <CommentInput
              onSubmit={handleCommentSubmit}
              isSubmitting={addCommentMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
