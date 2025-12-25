import { formatDate } from '../../lib/utils/date';

interface EssentialDetailsProps {
  customerName: string;
  dateOpened: Date | string;
  assignedAgent: string | null;
  lastUpdated: Date | string;
}

export function EssentialDetails({
  customerName,
  dateOpened,
  assignedAgent,
  lastUpdated,
}: EssentialDetailsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Essential Details</h2>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Customer Name</dt>
          <dd className="text-sm text-gray-900">{customerName}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Date Opened</dt>
          <dd className="text-sm text-gray-900">{formatDate(dateOpened)}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Assigned Agent</dt>
          <dd className="text-sm text-gray-900">{assignedAgent || 'Not assigned'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Last Updated</dt>
          <dd className="text-sm text-gray-900">{formatDate(lastUpdated)}</dd>
        </div>
      </dl>
    </div>
  );
}
