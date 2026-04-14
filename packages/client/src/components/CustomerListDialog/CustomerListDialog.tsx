import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Dialog, DialogHeader, Input, Button, Skeleton } from '@/components/obra';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import type { CustomerListDialogProps } from './types';

export function CustomerListDialog({ open, onOpenChange }: CustomerListDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null);

  const utils = trpc.useUtils();
  const { data: customers, isLoading, error, refetch } = trpc.customer.list.useQuery();

  const deleteCustomer = trpc.customer.delete.useMutation({
    onSuccess: () => {
      utils.customer.list.invalidate();
      setCustomerToDelete(null);
    },
    onError: () => {
      setCustomerToDelete(null);
    },
  });

  const filteredCustomers = customers?.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleDeleteClick = (id: string, firstName: string, lastName: string) => {
    setCustomerToDelete({ id, name: `${firstName} ${lastName}` });
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      deleteCustomer.mutate({ id: customerToDelete.id });
    }
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSearchQuery('');
    }
    onOpenChange(isOpen);
  };

  const renderContent = () => {
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
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      );
    }

    if (!filteredCustomers || filteredCustomers.length === 0) {
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
        {filteredCustomers.map((customer) => (
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
              onClick={() => handleDeleteClick(customer.id, customer.firstName, customer.lastName)}
              className="shrink-0 text-destructive hover:text-destructive hover:bg-red-50"
            >
              <Trash size={16} />
            </Button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleDialogOpenChange}
        type="Desktop Scrollable"
        header={
          <DialogHeader
            type="Header"
            title="Customers"
            onClose={() => handleDialogOpenChange(false)}
          />
        }
        className="w-[480px]"
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftDecoration={<Search size={16} className="text-gray-400" />}
          />
        </div>
        {renderContent()}
      </Dialog>

      <ConfirmationDialog
        open={customerToDelete !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCustomerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone and will also delete all associated cases.`}
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteCustomer.isPending}
        loadingText="Deleting..."
      />
    </>
  );
}
