import { ClaimStatus } from '@carton/shared';

interface StatusBadgeProps {
  status: ClaimStatus;
}

const statusConfig = {
  [ClaimStatus.TO_DO]: {
    label: 'To Do',
    className: 'bg-gray-200 text-gray-950',
  },
  [ClaimStatus.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-600',
  },
  [ClaimStatus.COMPLETED]: {
    label: 'Completed',
    className: 'bg-green-100 text-green-600',
  },
  [ClaimStatus.CLOSED]: {
    label: 'Closed',
    className: 'bg-gray-300 text-gray-700',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
