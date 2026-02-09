import { useParams } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { EmployeeInformation } from './components/EmployeeInformation';
import { RelatedCasesAccordion } from '../common/RelatedCasesAccordion';

export function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: employeeData, isLoading } = trpc.employee.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-2"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium mb-2">Employee not found</p>
          <p className="text-sm">This employee may have been deleted or does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col px-1 flex-1 gap-6 overflow-y-auto">
        <EmployeeInformation
          employeeId={employeeData.id}
          employeeData={employeeData}
        />
      </div>

      {/* Related Cases Sidebar */}
      <RelatedCasesAccordion cases={employeeData.createdCases} />
    </div>
  );
}
