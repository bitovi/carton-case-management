import { trpc } from '../lib/trpc';
import { CaseDetailsView } from '../components/case-details/CaseDetailsView';

export function CaseDetailsPage() {
  // For MVP, we'll load the first case from the list
  const { data: casesList, isLoading: isLoadingList } = trpc.cases.list.useQuery({ limit: 1 });

  const firstCaseId = casesList?.cases[0]?.id;

  const {
    data: caseData,
    isLoading: isLoadingCase,
    error,
  } = trpc.cases.getById.useQuery(
    { id: firstCaseId! },
    {
      enabled: !!firstCaseId,
    }
  );

  if (isLoadingList || isLoadingCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Case</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Cases Found</h2>
          <p className="text-gray-600">There are no cases available to display.</p>
        </div>
      </div>
    );
  }

  return <CaseDetailsView caseData={caseData} />;
}
