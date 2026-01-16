import { useParams } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { TaskInformation } from './components/TaskInformation';
import { TaskEssentialDetails } from './components/TaskEssentialDetails';
import type { TaskDetailsProps } from './types';

export function TaskDetails({ onMenuClick }: TaskDetailsProps) {
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
          <p className="text-lg font-medium mb-2">No task selected</p>
          <p className="text-sm">Select a task from the list or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Mobile Layout */}
      <div className="flex flex-col w-full lg:hidden gap-4 overflow-y-auto flex-1">
        <TaskInformation taskId={taskData.id} taskData={taskData} onMenuClick={onMenuClick} />
        <TaskEssentialDetails taskId={taskData.id} taskData={taskData} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 gap-4 overflow-hidden">
        <div className="flex flex-col flex-1 gap-6 overflow-y-auto">
          <TaskInformation taskId={taskData.id} taskData={taskData} onMenuClick={onMenuClick} />
        </div>
        <div className="h-[9px]" />
        <TaskEssentialDetails taskId={taskData.id} taskData={taskData} />
      </div>
    </div>
  );
}
