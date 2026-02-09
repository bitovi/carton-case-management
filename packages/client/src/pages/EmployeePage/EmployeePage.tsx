import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { EmployeeList } from '@/components/EmployeeList';
import { EmployeeDetails } from '@/components/EmployeeDetails';
import { CreateEmployeePage } from '@/pages/CreateEmployeePage';

export function EmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: employees } = trpc.employee.list.useQuery();

  useEffect(() => {
    // On desktop, if we're on /employees/ without an ID and we have employees, redirect to first employee
    // On mobile, we want to show the list first, so don't auto-redirect
    if (!id && employees && employees.length > 0 && location.pathname === '/employees/') {
      if (window.innerWidth >= 1024) {
        navigate(`/employees/${employees[0].id}`, { replace: true });
      }
    }
  }, [id, employees, navigate, location.pathname]);

  return (
    <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
      <div className="hidden lg:block">
        <EmployeeList />
      </div>

      {id === 'new' ? (
        <CreateEmployeePage />
      ) : id ? (
        <EmployeeDetails />
      ) : (
        <div className="flex-1 lg:hidden">
          <EmployeeList />
        </div>
      )}
    </div>
  );
}
