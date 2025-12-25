import { Link, useParams } from 'react-router-dom';
import { ClaimStatus } from '@carton/shared';

interface ClaimListItem {
  id: string;
  title: string;
  caseNumber: string;
  status: ClaimStatus;
}

interface ClaimSidebarProps {
  claims: ClaimListItem[];
}

const statusColorMap = {
  [ClaimStatus.TO_DO]: 'bg-gray-200',
  [ClaimStatus.IN_PROGRESS]: 'bg-blue-100',
  [ClaimStatus.COMPLETED]: 'bg-green-100',
  [ClaimStatus.CLOSED]: 'bg-gray-300',
};

export function ClaimSidebar({ claims }: ClaimSidebarProps) {
  const { id: currentId } = useParams<{ id: string }>();

  if (claims.length === 0) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Claims</h2>
        <p className="text-sm text-gray-500">No claims available</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Claims</h2>
      </div>
      <nav className="p-2">
        {claims.map((claim) => {
          const isActive = claim.id === currentId;
          return (
            <Link
              key={claim.id}
              to={`/claims/${claim.id}`}
              className={`block p-3 rounded-md mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className={`text-sm font-medium line-clamp-2 ${
                    isActive ? 'text-blue-900' : 'text-gray-900'
                  }`}
                >
                  {claim.title}
                </h3>
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${
                    statusColorMap[claim.status]
                  }`}
                  title={claim.status}
                />
              </div>
              <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {claim.caseNumber}
              </p>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
