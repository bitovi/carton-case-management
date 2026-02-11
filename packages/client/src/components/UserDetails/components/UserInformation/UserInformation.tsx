import { useState } from 'react';
import { MoreVertical, Trash } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { EditableTitle, EditableText } from '@/components/inline-edit';
import { format } from 'date-fns';
import { MoreOptionsMenu, MenuItem } from '@/components/common/MoreOptionsMenu';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';

interface UserInformationProps {
  userId: string;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dateJoined: Date | string;
  };
}

export function UserInformation({
  userId,
  userData,
}: UserInformationProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const updateUser = trpc.user.update.useMutation({
    onMutate: async (variables) => {
      await utils.user.getById.cancel({ id: userId });
      const previousUser = utils.user.getById.getData({ id: userId });

      if (previousUser) {
        utils.user.getById.setData(
          { id: userId },
          {
            ...previousUser,
            ...variables,
          }
        );
      }

      return { previousUser };
    },
    onSuccess: () => {
      utils.user.getById.invalidate({ id: userId });
      utils.user.list.invalidate();
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update user:', error);
      if (context?.previousUser) {
        utils.user.getById.setData({ id: userId }, context.previousUser);
      }
      alert('Failed to save changes. Please try again.');
    },
  });

  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      utils.user.list.invalidate();
      navigate('/users');
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user. Please try again.');
      setIsDeleteDialogOpen(false);
    },
  });

  const handleFirstNameSave = async (newFirstName: string): Promise<void> => {
    await updateUser.mutateAsync({
      id: userId,
      firstName: newFirstName,
    });
  };

  const handleLastNameSave = async (newLastName: string): Promise<void> => {
    await updateUser.mutateAsync({
      id: userId,
      lastName: newLastName,
    });
  };

  const handleUsernameSave = async (newUsername: string): Promise<void> => {
    await updateUser.mutateAsync({
      id: userId,
      username: newUsername,
    });
  };

  const handleEmailSave = async (newEmail: string): Promise<void> => {
    await updateUser.mutateAsync({
      id: userId,
      email: newEmail,
    });
  };

  const handleDeleteConfirm = () => {
    deleteUser.mutate({ id: userId });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Mobile: Title */}
        <div className="flex flex-col gap-1 lg:hidden w-full">
          <div className="flex items-center gap-2">
            <EditableTitle
              value={userData.firstName}
              onSave={handleFirstNameSave}
              className="text-2xl font-semibold truncate"
            />
            <EditableTitle
              value={userData.lastName}
              onSave={handleLastNameSave}
              className="text-2xl font-semibold truncate"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">@</span>
            <EditableTitle
              value={userData.username}
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
                value={userData.firstName}
                onSave={handleFirstNameSave}
                className="text-2xl font-semibold truncate"
              />
              <EditableTitle
                value={userData.lastName}
                onSave={handleLastNameSave}
                className="text-2xl font-semibold truncate"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">@</span>
              <EditableTitle
                value={userData.username}
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
                <MoreVertical size={20} />
              </Button>
            }
            align="end"
          >
            <MenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              icon={<Trash size={16} className="text-destructive" />}
              className="text-destructive hover:text-destructive"
            >
              Delete User
            </MenuItem>
          </MoreOptionsMenu>
        </div>

        {/* User Details */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Date Joined</p>
            <p className="text-base">{format(new Date(userData.dateJoined), 'M/d/yyyy')}</p>
          </div>

          <EditableText
            label="Email Address"
            value={userData.email}
            onSave={handleEmailSave}
            type="email"
          />
        </div>

        {/* Mobile: More menu */}
        <div className="lg:hidden">
          <MoreOptionsMenu
            trigger={
              <Button variant="outline" className="w-full">
                <MoreVertical size={16} className="mr-2" />
                More Actions
              </Button>
            }
            align="start"
          >
            <MenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              icon={<Trash size={16} className="text-destructive" />}
              className="text-destructive hover:text-destructive"
            >
              Delete User
            </MenuItem>
          </MoreOptionsMenu>
        </div>
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will also delete all associated cases."
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteUser.isPending}
      />
    </>
  );
}
