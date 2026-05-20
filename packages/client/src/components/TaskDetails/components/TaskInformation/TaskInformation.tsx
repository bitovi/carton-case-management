import { useState } from 'react';
import { MoreVertical, Trash } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/obra/Button';
import { type TaskStatus, TASK_STATUS_OPTIONS } from '@carton/shared/client';
import { EditableTextarea, EditableTitle } from '@/components/inline-edit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/obra/Select';
import { MoreOptionsMenu, MenuItem } from '@/components/common/MoreOptionsMenu';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import type { TaskInformationProps } from './types';

export function TaskInformation({ taskId, taskData }: TaskInformationProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const updateTask = trpc.task.update.useMutation({
    onMutate: async (variables) => {
      await utils.task.getById.cancel({ id: taskId });
      const previousTask = utils.task.getById.getData({ id: taskId });
      if (previousTask) {
        utils.task.getById.setData(
          { id: taskId },
          {
            ...previousTask,
            ...variables,
          }
        );
      }
      return { previousTask };
    },
    onSuccess: (data) => {
      utils.task.getById.setData({ id: taskId }, data);
      utils.task.list.invalidate();
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update task:', error);
      if (context?.previousTask) {
        utils.task.getById.setData({ id: taskId }, context.previousTask);
      }
    },
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      navigate('/tasks');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      setIsDeleteDialogOpen(false);
    },
  });

  const handleSummarySave = async (newSummary: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      summary: newSummary,
    });
  };

  const handleDescriptionSave = async (newDescription: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      description: newDescription,
    });
  };

  const handleDeleteConfirm = () => {
    deleteTask.mutate({ id: taskId });
  };

  const handleStatusChange = (newStatus: string) => {
    updateTask.mutate({
      id: taskId,
      status: newStatus as TaskStatus,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 lg:hidden w-full">
          <EditableTitle
            value={taskData.summary}
            onSave={handleSummarySave}
            className="text-xl font-semibold truncate"
            readonly={updateTask.isPending}
          />
        </div>

        <div className="lg:hidden self-start">
          <Select
            value={taskData.status}
            onValueChange={handleStatusChange}
            disabled={updateTask.isPending}
          >
            <SelectTrigger className="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden lg:flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <EditableTitle
              value={taskData.summary}
              onSave={handleSummarySave}
              className="text-3xl font-semibold"
              readonly={updateTask.isPending}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={taskData.status}
              onValueChange={handleStatusChange}
              disabled={updateTask.isPending}
            >
              <SelectTrigger className="px-3 py-1.5 rounded-full text-sm font-semibold bg-secondary hover:bg-secondary/80 border-0 h-auto w-auto flex-shrink-0 gap-2 focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MoreOptionsMenu
              trigger={
                <Button variant="ghost" size="mini" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
              align="end"
            >
              <MenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                icon={<Trash className="h-4 w-4 text-destructive" />}
                className="text-destructive hover:text-destructive"
              >
                Delete Task
              </MenuItem>
            </MoreOptionsMenu>
          </div>
        </div>

        <EditableTextarea
          label="Task Description"
          value={taskData.description}
          onSave={handleDescriptionSave}
          readonly={updateTask.isPending}
          placeholder="Enter task description..."
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
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteTask.isPending}
        loadingText="Deleting..."
      />
    </>
  );
}
