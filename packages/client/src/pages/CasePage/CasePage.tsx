import { useParams } from 'react-router-dom';
import { CaseList } from '@/components/CaseList';
import { CaseDetails } from '@/components/CaseDetails';
import { CreateCasePage } from '@/pages/CreateCasePage';

export function CasePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
      <div className="hidden lg:block">
        <CaseList />
      </div>

      {id === 'new' ? (
        <CreateCasePage />
      ) : id ? (
        <CaseDetails />
      ) : (
        <div className="flex-1 lg:hidden">
          <CaseList />
        </div>
      )}
    </div>
  );
}
