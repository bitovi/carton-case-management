import { Link } from 'react-router-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { formatCaseNumber } from '@carton/shared';

interface RelatedCasesProps {
  cases: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
}

export function RelatedCases({ cases }: RelatedCasesProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!cases || cases.length === 0) {
    return (
      <div className="lg:w-[300px] flex-shrink-0">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Related Cases</h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          {isExpanded && <p className="text-sm text-gray-500">No related cases</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-[300px] flex-shrink-0">
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">Related Cases</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {isExpanded && (
          <div className="flex flex-col gap-2">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/cases/${caseItem.id}`}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-[#00848b] truncate mb-1">
                  {caseItem.title}
                </p>
                <p className="text-xs text-gray-600">
                  {formatCaseNumber(caseItem.id, caseItem.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
