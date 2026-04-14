import { Trash } from 'lucide-react';
import { Button, Skeleton } from '@/components/obra';
import type { CustomerListDialogContentProps } from './types';

export function CustomerListDialogContent({
  customers,
  isLoading,
  error,
  searchQuery,
  onRetry,
  onDeleteClick,
}: CustomerListDialogContentProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2">
            <Skeleton className="h-5 bg-slate-200 w-3/4" />
            <Skeleton className="h-8 bg-slate-200 w-8" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-red-600 font-semibold">Error loading customers</p>
        <p className="text-sm text-gray-600">{error.message}</p>
        <Button onClick={onRetry} size="small">
          Retry
        </Button>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-500">
          {searchQuery ? 'No customers match your search' : 'No customers found'}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {customers.map((customer) => (
        <li
          key={customer.id}
          className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-900 truncate mr-2">
            {customer.firstName} {customer.lastName}
          </span>
          <Button
            variant="ghost"
            size="small"
            aria-label={`Delete ${customer.firstName} ${customer.lastName}`}
            onClick={() => onDeleteClick(customer.id, customer.firstName, customer.lastName)}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-red-50"
          >
            <Trash size={16} />
          </Button>
        </li>
      ))}
    </ul>
  );
}
