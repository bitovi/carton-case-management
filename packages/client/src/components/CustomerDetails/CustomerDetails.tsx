import { useParams } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CustomerInformation } from './components/CustomerInformation';
import { RelatedCases } from './components/RelatedCases';
import type { CustomerDetailsProps } from './types';

export function CustomerDetails({ onMenuClick }: CustomerDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const { data: customerData, isLoading } = trpc.customer.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-2"></div>
          <p>Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Customer not found</p>
          <p className="text-sm">This customer may have been deleted or does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col flex-1 gap-6 overflow-y-auto">
        <CustomerInformation
          customerId={customerData.id}
          customerData={customerData}
          onMenuClick={onMenuClick}
        />
      </div>

      {/* Related Cases Sidebar */}
      <RelatedCases cases={customerData.cases} />
    </div>
  );
}
