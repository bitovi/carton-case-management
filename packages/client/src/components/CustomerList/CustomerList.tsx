import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/obra/Button';
import { ListFilter } from 'lucide-react';
import type { CustomerListProps } from './types';

export function CustomerList({ onCustomerClick }: CustomerListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customers, isLoading, error, refetch } = trpc.customer.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/customers/new')}
          className="w-full mb-2 bg-[#f4f5f5] hover:bg-[#e5e7e7] text-[#192627]"
        >
          Create New Customer
        </Button>
        <div className="hidden lg:flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Filters</span>
          <ListFilter size={16} />
        </div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
            <Skeleton className="h-5 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/customers/new')}
          className="w-full mb-2 bg-[#f4f5f5] hover:bg-[#e5e7e7] text-[#192627]"
        >
          Create New Customer
        </Button>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading customers</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/customers/new')}
          className="w-full mb-2 bg-[#f4f5f5] hover:bg-[#e5e7e7] text-[#192627]"
        >
          Create New Customer
        </Button>
        <div className="text-center text-gray-500">
          <p className="text-sm">No customers found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/customers/new')}
        className="w-full mb-2 bg-[#f4f5f5] hover:bg-[#e5e7e7] text-[#192627]"
      >
        Create New Customer
      </Button>
      <div className="hidden lg:flex items-center justify-between mb-2 px-2">
        <span className="text-sm font-medium">Filters</span>
        <ListFilter size={16} className="text-gray-500" />
      </div>
      {customers?.map((customer: { id: string; firstName: string; lastName: string }) => {
        const isActive = customer.id === activeId;
        return (
          <Link
            key={customer.id}
            to={`/customers/${customer.id}`}
            onClick={onCustomerClick}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-[#e8feff]' : 'hover:bg-gray-100'
            }`}
          >
            <p className="text-sm font-medium text-[#00848b] w-full truncate">{customer.firstName} {customer.lastName}</p>
          </Link>
        );
      })}
    </div>
  );
}
