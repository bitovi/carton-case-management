import { Link, useParams } from 'react-router-dom';
import { trpc } from '../../lib/trpc';

export function CaseListSidebar() {
  const { id } = useParams<{ id: string }>();
  const { data: casesList, isLoading } = trpc.cases.list.useQuery({ limit: 10 });

  if (isLoading) {
    return (
      <aside className="w-80 bg-gray-100 border-r border-gray-200 p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-6 h-6"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {casesList?.cases.map((caseItem) => {
          const isSelected = id === caseItem.id;
          return (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
              className={`block px-6 py-4 border-b border-gray-200 hover:bg-white transition-colors ${
                isSelected ? 'bg-white' : ''
              }`}
            >
              <h3 className={`font-medium mb-1 ${isSelected ? 'text-[#1a5d5d]' : 'text-gray-900'}`}>
                {caseItem.title}
              </h3>
              <p className="text-sm text-gray-600">#{caseItem.caseNumber}</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
