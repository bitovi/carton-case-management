import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EditableSelect } from '@/components/inline-edit';
import { trpc } from '@/lib/trpc';
import { type TaskPriority, TASK_PRIORITY_OPTIONS } from '@carton/shared/client';
import type { TaskEssentialDetailsProps } from './types';

export function TaskEssentialDetails({ taskData, taskId }: TaskEssentialDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const trpcUtils = trpc.useUtils();

  const { data: users } = trpc.user.list.useQuery();
  const { data: cases } = trpc.case.list.useQuery();

  const updateTaskMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      trpcUtils.task.getById.invalidate({ id: taskId });
      trpcUtils.task.list.invalidate();
    },
  });

  const handlePriorityChange = async (newPriority: string) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      priority: newPriority as TaskPriority,
    });
  };

  // Special value to represent "unassigned" since Radix Select doesn't allow empty strings
  const UNASSIGNED_VALUE = '__unassigned__';

  const handleAssigneeChange = async (newAssigneeId: string) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      assignedTo: newAssigneeId === UNASSIGNED_VALUE ? null : newAssigneeId,
    });
  };

  const handleCaseChange = async (newCaseId: string) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      caseId: newCaseId === UNASSIGNED_VALUE ? null : newCaseId,
    });
  };

  // Get customer name from the associated case
  const customerName = taskData.case
    ? `${taskData.case.customer.firstName} ${taskData.case.customer.lastName}`
    : 'No case assigned';

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
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Customer Name</span>
            {taskData.case ? (
              <Link
                to={`/customers/${taskData.case.customer.id}`}
                className="text-sm font-medium px-1 py-2 text-[#00848b] hover:underline"
              >
                {customerName}
              </Link>
            ) : (
              <p className="text-sm font-medium px-1 py-2 text-gray-500">{customerName}</p>
            )}
          </div>
          <EditableSelect
            label="Priority"
            value={taskData.priority || 'MEDIUM'}
            options={[...TASK_PRIORITY_OPTIONS]}
            onSave={handlePriorityChange}
            readonly={updateTaskMutation.isPending}
          />
          <EditableSelect
            label="Assigned To"
            value={taskData.assignedTo || UNASSIGNED_VALUE}
            options={[
              { value: UNASSIGNED_VALUE, label: 'Unassigned' },
              ...(users || []).map((u: { id: string; name: string }) => ({ value: u.id, label: u.name })),
            ]}
            onSave={handleAssigneeChange}
            readonly={updateTaskMutation.isPending}
            placeholder="Unassigned"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Date Opened</span>
            <p className="text-sm font-medium px-1 py-2">
              {new Date(taskData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Created By</span>
            <p className="text-sm font-medium px-1 py-2">{taskData.creator.name}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Last Updated</span>
            <p className="text-sm font-medium px-1 py-2">
              {new Date(taskData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-950 tracking-[0.18px] leading-4 px-1">Updated By</span>
            <p className="text-sm font-medium px-1 py-2">{taskData.updater.name}</p>
          </div>
          <EditableSelect
            label="Assigned Case"
            value={taskData.caseId || UNASSIGNED_VALUE}
            options={[
              { value: UNASSIGNED_VALUE, label: 'No case' },
              ...(cases || []).map((c: { id: string; title: string }) => ({ value: c.id, label: c.title })),
            ]}
            onSave={handleCaseChange}
            readonly={updateTaskMutation.isPending}
            placeholder="No case"
          />
        </>
      )}
    </div>
  );
}
