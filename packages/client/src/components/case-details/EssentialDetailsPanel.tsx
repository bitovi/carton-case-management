import { Card } from '../ui/card';

export interface EssentialDetailsPanelProps {
  status: string;
  assignee?: {
    name: string;
    email: string;
  };
  creator: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function EssentialDetailsPanel({
  status,
  assignee,
  creator,
  createdAt,
  updatedAt,
}: EssentialDetailsPanelProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Essential Details</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500 block mb-1">Status</label>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
          >
            {status.replace('_', ' ')}
          </span>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 block mb-1">Created By</label>
          <div className="text-sm text-gray-900">
            <div className="font-medium">{creator.name}</div>
            <div className="text-gray-600">{creator.email}</div>
          </div>
        </div>

        {assignee && (
          <div>
            <label className="text-sm font-medium text-gray-500 block mb-1">Assigned To</label>
            <div className="text-sm text-gray-900">
              <div className="font-medium">{assignee.name}</div>
              <div className="text-gray-600">{assignee.email}</div>
            </div>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500 block mb-1">Created</label>
          <div className="text-sm text-gray-900">{formatDate(createdAt)}</div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500 block mb-1">Last Updated</label>
          <div className="text-sm text-gray-900">{formatDate(updatedAt)}</div>
        </div>
      </div>
    </Card>
  );
}
