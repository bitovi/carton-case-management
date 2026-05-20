import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { TaskList } from '@/components/TaskList';
import { TaskDetails } from '@/components/TaskDetails';
import { CreateTaskPage } from '@/pages/CreateTaskPage';

export function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tasks } = trpc.task.list.useQuery();

  useEffect(() => {
    if (
      !id &&
      tasks &&
      tasks.length > 0 &&
      (location.pathname === '/tasks' || location.pathname === '/tasks/')
    ) {
      if (window.innerWidth >= 1024) {
        navigate(`/tasks/${tasks[0].id}`, { replace: true });
      }
    }
  }, [id, tasks, navigate, location.pathname]);

  return (
    <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
      <div className="hidden lg:block">
        <TaskList />
      </div>

      {id === 'new' ? (
        <CreateTaskPage />
      ) : id ? (
        <TaskDetails />
      ) : (
        <div className="flex-1 lg:hidden">
          <TaskList />
        </div>
      )}
    </div>
  );
}
