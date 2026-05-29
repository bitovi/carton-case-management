import { useParams } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { formatTaskNumber } from '@carton/shared/client';

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: taskData, isLoading } = trpc.task.getById.useQuery({ id: id! }, { enabled: !!id });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-2"></div>
          <p>Loading task details...</p>
        </div>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Task not found</p>
          <p className="text-sm">This task may have been deleted or does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 h-full flex-1 overflow-auto">
      <p className="text-sm text-gray-600 mb-2">{formatTaskNumber(taskData.id, taskData.createdAt)}</p>
      <h1 className="text-2xl font-bold mb-4">{taskData.title}</h1>
      <p className="text-gray-800 whitespace-pre-wrap mb-6">{taskData.description}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Assigned Case:</span> {taskData.case.title}
        </p>
        <p>
          <span className="font-semibold">Assigned Employee:</span>{' '}
          {taskData.assignee ? `${taskData.assignee.firstName} ${taskData.assignee.lastName}` : 'Unassigned'}
        </p>
        <p>
          <span className="font-semibold">Priority:</span> {taskData.priority}
        </p>
      </div>
    </div>
  );
}
