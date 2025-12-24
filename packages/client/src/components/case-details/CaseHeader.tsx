import { Card } from '../ui/card';

export interface CaseHeaderProps {
  caseId: string;
  title: string;
  caseType: string;
  status: string;
  customerName: string;
  createdAt: Date;
  updatedAt: Date;
}

export function CaseHeader({
  caseId,
  title,
  caseType,
  status,
  customerName,
  createdAt,
  updatedAt,
}: CaseHeaderProps) {
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
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{caseType}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
          >
            {status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Customer:</span>
            <span className="ml-2 font-medium text-gray-900">{customerName}</span>
          </div>
          <div>
            <span className="text-gray-500">Case ID:</span>
            <span className="ml-2 font-medium text-gray-900">{caseId}</span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 text-gray-900">{formatDate(createdAt)}</span>
          </div>
          <div>
            <span className="text-gray-500">Last Updated:</span>
            <span className="ml-2 text-gray-900">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
