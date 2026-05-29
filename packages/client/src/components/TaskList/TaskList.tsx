import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/obra/Skeleton';
import { Button } from '@/components/obra/Button';
import type { TaskListProps, TaskListItem } from './types';

export function TaskList({ onTaskClick }: TaskListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tasks, isLoading, error, refetch } = trpc.task.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/tasks/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create Task
        </Button>
        <div className="flex flex-col gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/tasks/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create Task
        </Button>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading tasks</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/tasks/new')}
          variant="secondary"
          className="w-full mb-2"
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
    <div className="flex flex-col w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/tasks/new')}
        variant="secondary"
        className="w-full mb-2"
      >
        Create Task
      </Button>
      <div className="flex flex-col gap-2">
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
                  {taskItem.case.title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
