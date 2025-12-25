import { ClaimStatus } from '@carton/shared';
import { StatusBadge } from './StatusBadge';

interface ClaimHeaderProps {
  title: string;
  caseNumber: string;
  status: ClaimStatus;
}

export function ClaimHeader({ title, caseNumber, status }: ClaimHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500">{caseNumber}</p>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
