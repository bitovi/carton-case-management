import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { TaskListProps, TaskListItem } from './types';

function formatTaskNumber(id: string, createdAt: Date | string): string {
  const date = new Date(createdAt);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const idSuffix = id.slice(-4).toUpperCase();
  return `T-${year}${month}-${idSuffix}`;
}

export function TaskList({ onTaskClick }: TaskListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tasks, isLoading, error, refetch } = trpc.task.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/tasks/new')}
          className="w-full mb-2 bg-[#00848b] hover:bg-[#006d73] text-white"
        >
          Create Task
        </Button>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/tasks/new')}
          className="w-full mb-2 bg-[#00848b] hover:bg-[#006d73] text-white"
        >
          Create Task
        </Button>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading tasks</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/tasks/new')}
          className="w-full mb-2 bg-[#00848b] hover:bg-[#006d73] text-white"
        >
          Create Task
        </Button>
        <div className="text-center text-gray-500">
          <p className="text-sm">No tasks found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/tasks/new')}
        className="w-full mb-2 bg-[#00848b] hover:bg-[#006d73] text-white"
      >
        Create Task
      </Button>
      {tasks?.map((taskItem: TaskListItem) => {
        const isActive = taskItem.id === activeId;
        return (
          <Link
            key={taskItem.id}
            to={`/tasks/${taskItem.id}`}
            onClick={onTaskClick}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-[#e8feff]' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex flex-col items-start text-sm leading-[21px] w-full lg:w-[167px]">
              <p className="font-semibold text-[#00848b] w-full truncate">{taskItem.title}</p>
              <p className="font-normal text-[#192627] w-full truncate">
                {formatTaskNumber(taskItem.id, taskItem.createdAt)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
