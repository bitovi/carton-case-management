import { useState } from 'react';
import { List, MoreVertical, Trash, Star } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { EditableTitle } from '@/components/inline-edit';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

interface CustomerInformationProps {
  customerId: string;
  customerData: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dateJoined: Date | string;
    satisfactionRate: number | null;
  };
  onMenuClick?: () => void;
}

export function CustomerInformation({
  customerId,
  customerData,
  onMenuClick,
}: CustomerInformationProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const updateCustomer = trpc.customer.update.useMutation({
    onMutate: async (variables) => {
      await utils.customer.getById.cancel({ id: customerId });
      const previousCustomer = utils.customer.getById.getData({ id: customerId });

      if (previousCustomer) {
        utils.customer.getById.setData(
          { id: customerId },
          {
            ...previousCustomer,
            ...variables,
          }
        );
      }

      return { previousCustomer };
    },
    onSuccess: () => {
      utils.customer.getById.invalidate({ id: customerId });
      utils.customer.list.invalidate();
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update customer:', error);
      if (context?.previousCustomer) {
        utils.customer.getById.setData({ id: customerId }, context.previousCustomer);
      }
      alert('Failed to save changes. Please try again.');
    },
  });

  const deleteCustomer = trpc.customer.delete.useMutation({
    onSuccess: () => {
      utils.customer.list.invalidate();
      navigate('/customers');
    },
    onError: (error) => {
      console.error('Failed to delete customer:', error);
      alert('Failed to delete customer. Please try again.');
      setIsDeleteDialogOpen(false);
    },
  });

  const handleFirstNameSave = async (newFirstName: string): Promise<void> => {
    await updateCustomer.mutateAsync({
      id: customerId,
      firstName: newFirstName,
    });
  };

  const handleLastNameSave = async (newLastName: string): Promise<void> => {
    await updateCustomer.mutateAsync({
      id: customerId,
      lastName: newLastName,
    });
  };

  const handleUsernameSave = async (newUsername: string): Promise<void> => {
    await updateCustomer.mutateAsync({
      id: customerId,
      username: newUsername,
    });
  };

  const handleEmailSave = async (newEmail: string): Promise<void> => {
    await updateCustomer.mutateAsync({
      id: customerId,
      email: newEmail,
    });
  };

  const handleDeleteConfirm = () => {
    deleteCustomer.mutate({ id: customerId });
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={20} className="fill-orange-400 text-orange-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={20} className="text-orange-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={20} className="fill-orange-400 text-orange-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={20} className="text-orange-400" />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Mobile: Menu button + Title */}
        <div className="flex items-start gap-4 lg:hidden w-full">
          <Button
            onClick={onMenuClick}
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-9 h-9 bg-[#e8feff] border-gray-300 shadow-sm hover:bg-[#bcecef]"
            aria-label="Open customer list"
          >
            <List size={16} className="text-gray-700" />
          </Button>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <EditableTitle
                value={customerData.firstName}
                onSave={handleFirstNameSave}
                className="text-2xl font-semibold truncate"
              />
              <EditableTitle
                value={customerData.lastName}
                onSave={handleLastNameSave}
                className="text-2xl font-semibold truncate"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">@</span>
              <EditableTitle
                value={customerData.username}
                onSave={handleUsernameSave}
                className="text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Desktop: Title + More menu */}
        <div className="hidden lg:flex items-start justify-between w-full">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <EditableTitle
                value={customerData.firstName}
                onSave={handleFirstNameSave}
                className="text-2xl font-semibold truncate"
              />
              <EditableTitle
                value={customerData.lastName}
                onSave={handleLastNameSave}
                className="text-2xl font-semibold truncate"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">@</span>
              <EditableTitle
                value={customerData.username}
                onSave={handleUsernameSave}
                className="text-sm text-gray-600"
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash size={16} className="mr-2" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Customer Details */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Date Joined</p>
            <p className="text-base">{format(new Date(customerData.dateJoined), 'M/d/yyyy')}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
            <EditableTitle
              value={customerData.email}
              onSave={handleEmailSave}
              className="text-base"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Satisfaction Rate</p>
            {renderStars(customerData.satisfactionRate)}
          </div>
        </div>

        {/* Mobile: More menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <MoreVertical size={16} className="mr-2" />
                More Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash size={16} className="mr-2" />
                Delete Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? This action cannot be undone and will also delete all associated cases."
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteCustomer.isPending}
      />
    </>
  );
}
