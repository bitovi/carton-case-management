import { CaseList } from '@/components/CaseList';
import { CaseDetails } from '@/components/CaseDetails';

export function CasePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block">
        <CaseList />
      </div>
      <CaseDetails />
    </div>
  );
}
