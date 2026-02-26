import { useState } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { moreVerticalIcon, trashIcon, starIcon } from '@progress/kendo-svg-icons';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { EditableTitle, EditableText } from '@/components/inline-edit';
import { format } from 'date-fns';
import { MoreOptionsMenu, MenuItem } from '@/components/common/MoreOptionsMenu';
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
}

export function CustomerInformation({ customerId, customerData }: CustomerInformationProps) {
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
          <SvgIcon
            key={`full-${i}`}
            icon={starIcon}
            size="medium"
            className="fill-orange-400 text-orange-400"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <SvgIcon icon={starIcon} size="medium" className="text-orange-400" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <SvgIcon icon={starIcon} size="medium" className="fill-orange-400 text-orange-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <SvgIcon key={`empty-${i}`} icon={starIcon} size="medium" className="text-orange-400" />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Mobile: Title */}
        <div className="flex flex-col gap-1 lg:hidden w-full">
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
          <MoreOptionsMenu
            trigger={
              <Button
                variant="ghost"
                size="small"
                className="flex-shrink-0 px-2"
                aria-label="More options"
              >
                <SvgIcon icon={moreVerticalIcon} size="medium" />
              </Button>
            }
            align="end"
          >
            <MenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              icon={<SvgIcon icon={trashIcon} size="small" className="text-destructive" />}
              className="text-destructive hover:text-destructive"
            >
              Delete Customer
            </MenuItem>
          </MoreOptionsMenu>
        </div>

        {/* Customer Details */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Date Joined</p>
            <p className="text-base">{format(new Date(customerData.dateJoined), 'M/d/yyyy')}</p>
          </div>

          <EditableText
            label="Email Address"
            value={customerData.email}
            onSave={handleEmailSave}
            type="email"
          />

          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Satisfaction Rate</p>
            {renderStars(customerData.satisfactionRate)}
          </div>
        </div>

        {/* Mobile: More menu */}
        <div className="lg:hidden">
          <MoreOptionsMenu
            trigger={
              <Button variant="outline" className="w-full">
                <SvgIcon icon={moreVerticalIcon} size="small" className="mr-2" />
                More Actions
              </Button>
            }
            align="start"
          >
            <MenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              icon={<SvgIcon icon={trashIcon} size="small" className="text-destructive" />}
              className="text-destructive hover:text-destructive"
            >
              Delete Customer
            </MenuItem>
          </MoreOptionsMenu>
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
