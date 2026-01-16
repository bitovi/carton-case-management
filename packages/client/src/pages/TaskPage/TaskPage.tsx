import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { TaskList } from '@/components/TaskList';
import { TaskDetails } from '@/components/TaskDetails';
import { CreateTaskPage } from '@/pages/CreateTaskPage';
import { Sheet } from '@/components/ui/sheet';

export function TaskPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tasks } = trpc.task.list.useQuery();

  useEffect(() => {
    // If we're on /tasks/ without an ID and we have tasks, redirect to first task
    if (!id && tasks && tasks.length > 0 && location.pathname === '/tasks/') {
      navigate(`/tasks/${tasks[0].id}`, { replace: true });
    }
  }, [id, tasks, navigate, location.pathname]);

  return (
    <>
      <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
        <div className="hidden lg:block">
          <TaskList />
        </div>
        {id === 'new' ? (
          <CreateTaskPage />
        ) : (
          <TaskDetails onMenuClick={() => setIsSheetOpen(true)} />
        )}
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="p-2">
          <TaskList onTaskClick={() => setIsSheetOpen(false)} />
        </div>
      </Sheet>
    </>
  );
}
