import { useState } from 'react';
import { Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Dialog, DialogHeader, Input } from '@/components/obra';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { CustomerListDialogContent } from './components/CustomerListDialogContent';
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
        <CustomerListDialogContent
          customers={filteredCustomers}
          isLoading={isLoading}
          error={error}
          searchQuery={searchQuery}
          onRetry={refetch}
          onDeleteClick={handleDeleteClick}
        />
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
