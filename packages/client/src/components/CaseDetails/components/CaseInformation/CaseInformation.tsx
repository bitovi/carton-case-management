import { useState } from 'react';
import { List, MoreVertical, Trash } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { formatCaseNumber, type CaseStatus, CASE_STATUS_OPTIONS } from '@carton/shared/client';
import { EditableTitle, EditableTextarea } from '@/components/inline-edit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/obra/Select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import type { CaseInformationProps } from './types';

export function CaseInformation({ caseId, caseData, onMenuClick }: CaseInformationProps) {
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
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update case:', error);
      // Roll back to previous value on error
      if (context?.previousCase) {
        utils.case.getById.setData({ id: caseId }, context.previousCase);
      }
    },
  });

  const deleteCase = trpc.case.delete.useMutation({
    onSuccess: () => {
      utils.case.list.invalidate();
      navigate('/cases');
    },
    onError: (error) => {
      console.error('Failed to delete case:', error);
      setIsDeleteDialogOpen(false);
    },
  });

  const handleTitleSave = async (newTitle: string) => {
    await updateCase.mutateAsync({
      id: caseId,
      title: newTitle,
    });
  };

  const handleDescriptionSave = async (newDescription: string) => {
    await updateCase.mutateAsync({
      id: caseId,
      description: newDescription,
    });
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
            size="mini"
            className="flex-shrink-0 w-9 h-9 bg-[#e8feff] border-gray-300 shadow-sm hover:bg-[#bcecef]"
            aria-label="Open case list"
          >
            <List size={16} className="text-gray-700" />
          </Button>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <EditableTitle
              value={caseData.title}
              onSave={handleTitleSave}
              className="text-xl font-semibold truncate"
              readonly={updateCase.isPending}
            />
            <p className="text-base font-semibold text-gray-600">
              {formatCaseNumber(caseData.id, caseData.createdAt)}
            </p>
          </div>
        </div>

        {/* Mobile: Status Badge */}
        <div className="lg:hidden self-start">
          <Select
            value={caseData.status}
            onValueChange={handleStatusChange}
            disabled={updateCase.isPending}
          >
            <SelectTrigger className="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CASE_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Title + Status on same line */}
        <div className="hidden lg:flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <EditableTitle
              value={caseData.title}
              onSave={handleTitleSave}
              className="text-3xl font-semibold"
              readonly={updateCase.isPending}
            />
            <p className="text-xl text-gray-600">
              {formatCaseNumber(caseData.id, caseData.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={caseData.status}
              onValueChange={handleStatusChange}
              disabled={updateCase.isPending}
            >
              <SelectTrigger className="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="mini" className="h-8 w-8">
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
        <EditableTextarea
          label="Case Description"
          value={caseData.description}
          onSave={handleDescriptionSave}
          readonly={updateCase.isPending}
          placeholder="Enter case description..."
          validate={(value) => {
            if (value.trim() === '') return 'Description cannot be empty';
            return null;
          }}
        />
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Case"
        description={`Are you sure you want to delete ${caseData.title}? This action cannot be undone.`}
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteCase.isPending}
        loadingText="Deleting..."
      />
    </>
  );
}
