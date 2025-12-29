import { Link } from 'react-router-dom';
import { trpc } from '@/lib/trpc';

export default function HomePage() {
  const { data: cases, isLoading, error, refetch, isFetching } = trpc.case.list.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <div className="text-center text-gray-600">Loading cases...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center text-red-600 mb-4">
            <p className="text-lg font-semibold mb-2">Error loading cases</p>
            <p className="text-sm">{error.message}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cases</h1>
        {isFetching && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            Updating...
          </div>
        )}
      </div>

      {cases && cases.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg mb-2">No cases found</p>
          <p className="text-sm">Create a new case to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases?.map((caseItem) => (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{caseItem.title}</h2>
                  <p className="text-gray-600 mb-4">{caseItem.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Status: {caseItem.status}</span>
                    <span>Created by: {caseItem.creator.name}</span>
                    {caseItem.assignee && <span>Assigned to: {caseItem.assignee.name}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
