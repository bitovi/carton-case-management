import { useState } from 'react';
import { Button } from '@/components/obra/Button';
import { EditableSelect } from '@/components/inline-edit';
import { trpc } from '@/lib/trpc';
import type { TaskEssentialDetailsProps } from './types';

export function TaskEssentialDetails({ taskData, taskId }: TaskEssentialDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const trpcUtils = trpc.useUtils();

  const { data: cases } = trpc.case.list.useQuery();
  const { data: users } = trpc.user.list.useQuery();

  const updateTaskMutation = trpc.task.update.useMutation({
    onMutate: async (variables) => {
      await trpcUtils.task.getById.cancel({ id: taskId });
      const previousTask = trpcUtils.task.getById.getData({ id: taskId });
      if (previousTask) {
        trpcUtils.task.getById.setData(
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
      trpcUtils.task.getById.setData({ id: taskId }, data);
      trpcUtils.task.list.invalidate();
    },
    onError: (error, _variables, context) => {
      console.error('Failed to update task:', error);
      if (context?.previousTask) {
        trpcUtils.task.getById.setData({ id: taskId }, context.previousTask);
      }
    },
  });

  const handleCaseChange = async (newCaseId: string) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      caseId: newCaseId,
    });
  };

  const UNASSIGNED_VALUE = '__unassigned__';

  const handleAssigneeChange = async (newAssigneeId: string) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      assignedTo: newAssigneeId === UNASSIGNED_VALUE ? null : newAssigneeId,
    });
  };

  return (
    <div className="w-full lg:w-[200px] flex flex-col gap-3">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="flex items-center justify-between py-4 w-full h-auto"
      >
        <h3 className="text-sm font-semibold">Essential Details</h3>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform text-gray-600 ${!isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      {isExpanded && (
        <>
          <EditableSelect
            label="Assigned Case"
            value={taskData.caseId}
            displayValue={taskData.case.title}
            options={(cases || []).map((c: { id: string; title: string }) => ({
              value: c.id,
              label: c.title,
            }))}
            onSave={handleCaseChange}
            readonly={updateTaskMutation.isPending}
            placeholder="Select case"
          />
          <EditableSelect
            label="Assigned To"
            value={taskData.assignedTo || UNASSIGNED_VALUE}
            displayValue={
              taskData.assignee
                ? `${taskData.assignee.firstName} ${taskData.assignee.lastName}`
                : 'Unassigned'
            }
            options={[
              { value: UNASSIGNED_VALUE, label: 'Unassigned' },
              ...(users || []).map(
                (user: { id: string; firstName: string; lastName: string }) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName}`,
                })
              ),
            ]}
            onSave={handleAssigneeChange}
            readonly={updateTaskMutation.isPending}
            placeholder="Unassigned"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">
              Created By
            </span>
            <p className="text-sm font-medium px-1 py-2">
              {taskData.creator.firstName} {taskData.creator.lastName}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
