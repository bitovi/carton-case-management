import { useState } from 'react';
import { List, MoreVertical, Trash } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { formatCaseNumber, type CaseStatus, CASE_STATUS_OPTIONS } from '@carton/shared';
import { EditableTitle } from '../../../EditableTitle';
import { EditableSelect } from '../../../EditableSelect';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import { DeleteCaseDialog } from '@/components/DeleteCaseDialog';
import { useNavigate } from 'react-router-dom';
import type { CaseInformationProps } from './types';

export function CaseInformation({ caseId, caseData, onMenuClick }: CaseInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(caseData.description);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const updateCase = trpc.case.update.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.case.getById.cancel({ id: caseId });

      // Snapshot the previous value
      const previousCase = utils.case.getById.getData({ id: caseId });

      // Optimistically update the cache
      if (previousCase) {
        utils.case.getById.setData(
          { id: caseId },
          {
            ...previousCase,
            ...variables,
          }
        );
      }

      return { previousCase };
    },
    onSuccess: () => {
      utils.case.getById.invalidate({ id: caseId });
      utils.case.list.invalidate();
      setIsEditing(false);
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update case:', error);
      // Roll back to previous value on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
      alert('Failed to save changes. Please try again.');
    },
  });

  const deleteCase = trpc.case.delete.useMutation({
    onSuccess: () => {
      utils.case.list.invalidate();
      navigate('/cases');
    },
    onError: (error) => {
      console.error('Failed to delete case:', error);
      alert('Failed to delete case. Please try again.');
      setIsDeleteDialogOpen(false);
    },
  });

  const handleTitleSave = (newTitle: string) => {
    updateCase.mutate({
      id: caseId,
      title: newTitle,
    });
  };

  const handleSave = () => {
    if (editedDescription.trim() === '') {
      alert('Description cannot be empty');
      return;
    }

    updateCase.mutate({
      id: caseId,
      description: editedDescription,
    });
  };

  const handleCancel = () => {
    setEditedDescription(caseData.description);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    deleteCase.mutate({ id: caseId });
  };

  const handleStatusChange = (newStatus: string) => {
    updateCase.mutate({
      id: caseId,
      status: newStatus as CaseStatus,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Mobile: Menu button + Title */}
        <div className="flex items-start gap-4 lg:hidden w-full">
          <Button
            onClick={onMenuClick}
            variant="outline"
            size="icon"
            className="flex-shrink-0 w-9 h-9 bg-[#e8feff] border-gray-300 shadow-sm hover:bg-[#bcecef]"
            aria-label="Open case list"
          >
            <List size={16} className="text-gray-700" />
          </Button>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <EditableTitle
              value={caseData.title}
              onSave={handleTitleSave}
              isLoading={updateCase.isPending}
              className="text-xl font-semibold truncate"
              inputClassName="text-xl font-semibold"
            />
            <p className="text-base font-semibold text-gray-600">
              {formatCaseNumber(caseData.id, caseData.createdAt)}
            </p>
          </div>
        </div>

        {/* Mobile: Status Badge */}
        <div className="lg:hidden self-start">
          <EditableSelect
            value={caseData.status}
            options={[...CASE_STATUS_OPTIONS]}
            onChange={handleStatusChange}
            disabled={updateCase.isPending}
            alwaysEditing
            triggerClassName="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0"
          />
        </div>

        {/* Desktop: Title + Status on same line */}
        <div className="hidden lg:flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <EditableTitle
              value={caseData.title}
              onSave={handleTitleSave}
              isLoading={updateCase.isPending}
              className="text-3xl font-semibold"
              inputClassName="text-3xl font-semibold"
            />
            <p className="text-xl text-gray-600">
              {formatCaseNumber(caseData.id, caseData.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <EditableSelect
              value={caseData.status}
              options={[...CASE_STATUS_OPTIONS]}
              onChange={handleStatusChange}
              disabled={updateCase.isPending}
              alwaysEditing
              triggerClassName="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Case
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">Case Description</h2>

          {!isEditing ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {caseData.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex flex-col">
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="min-h-[76px] resize-y"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSave}
                  disabled={updateCase.isPending}
                  className="bg-[#00848b] text-white hover:bg-[#006b72]"
                >
                  {updateCase.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={updateCase.isPending}
                  variant="outline"
                  className="text-[#4c5b5c]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteCaseDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        caseTitle={caseData.title}
        isDeleting={deleteCase.isPending}
      />
    </>
  );
}
