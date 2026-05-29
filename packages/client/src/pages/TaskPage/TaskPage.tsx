import { useParams } from 'react-router-dom';
import { TaskDetails } from '@/components/TaskDetails';
import { CreateTaskPage } from '@/pages/CreateTaskPage';

export function TaskPage() {
  const { id } = useParams<{ id: string }>();

  if (id === 'new') {
    return (
      <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
        <CreateTaskPage />
      </div>
    );
  }

  return (
    <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
      <TaskDetails />
    </div>
  );
}
