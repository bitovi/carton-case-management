import { useState } from 'react';
import { List, MoreVertical, Trash } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { EditableTitle, EditableTextarea } from '@/components/inline-edit';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useNavigate } from 'react-router-dom';
import type { TaskInformationProps } from './types';

function formatTaskNumber(id: string, createdAt: Date | string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const idSuffix = id.slice(-4).toUpperCase();
  return `T-${year}${month}-${idSuffix}`;
}

export function TaskInformation({ taskId, taskData, onMenuClick }: TaskInformationProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const utils = trpc.useUtils();
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.getById.invalidate({ id: taskId });
      utils.task.list.invalidate();
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
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

  const handleTitleSave = async (newTitle: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      title: newTitle,
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
            aria-label="Open task list"
          >
            <List size={16} className="text-gray-700" />
          </Button>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <EditableTitle
              value={taskData.title}
              onSave={handleTitleSave}
              className="text-xl font-semibold truncate"
              readonly={updateTask.isPending}
            />
            <p className="text-base font-semibold text-gray-600">
              {formatTaskNumber(taskData.id, taskData.createdAt)}
            </p>
          </div>
        </div>

        {/* Desktop: Title */}
        <div className="hidden lg:flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <EditableTitle
              value={taskData.title}
              onSave={handleTitleSave}
              className="text-3xl font-semibold"
              readonly={updateTask.isPending}
            />
            <p className="text-xl text-gray-600">
              {formatTaskNumber(taskData.id, taskData.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
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
        description={`Are you sure you want to delete ${taskData.title}? This action cannot be undone.`}
        confirmText="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700"
        isLoading={deleteTask.isPending}
        loadingText="Deleting..."
      />
    </>
  );
}
