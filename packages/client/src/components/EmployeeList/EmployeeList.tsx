import { Link, useParams, useNavigate } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { Skeleton } from '@/components/obra/Skeleton';
import { Button } from '@/components/obra/Button';
import type { EmployeeListProps } from './types';

export function EmployeeList({ onEmployeeClick }: EmployeeListProps) {
  const { id: activeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employees, isLoading, error, refetch } = trpc.employee.list.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px]">
        <Button
          onClick={() => navigate('/employees/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New Employee
        </Button>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between px-4 py-2 rounded-lg">
            <Skeleton className="h-5 bg-slate-200 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/employees/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New Employee
        </Button>
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading employees</p>
          <p className="text-sm text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()} size="small">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-[200px] p-4">
        <Button
          onClick={() => navigate('/employees/new')}
          variant="secondary"
          className="w-full mb-2"
        >
          Create New Employee
        </Button>
        <div className="text-center text-gray-500">
          <p className="text-sm">No employees found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full lg:w-[200px]">
      <Button
        onClick={() => navigate('/employees/new')}
        variant="secondary"
        className="w-full mb-2"
      >
        Create New Employee
      </Button>
      {employees?.map((employee: { id: string; firstName: string; lastName: string }) => {
        const isActive = employee.id === activeId;
        return (
          <Link
            key={employee.id}
            to={`/employees/${employee.id}`}
            onClick={onEmployeeClick}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-[#e8feff]' : 'hover:bg-gray-100'
            }`}
          >
            <p className="text-sm font-medium text-[#00848b] w-full truncate">{employee.firstName} {employee.lastName}</p>
          </Link>
        );
      })}
    </div>
  );
}
