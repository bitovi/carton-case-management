import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';

export default function HomePage() {
  const { data: cases, isLoading, error } = trpc.case.list.useQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading cases: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Cases</h1>
      </div>

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
    </div>
  );
}
