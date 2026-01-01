import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CaseList } from '@/components/CaseList';
import { CaseDetails } from '@/components/CaseDetails';
import { CreateCasePage } from '@/pages/CreateCasePage';
import { Sheet } from '@/components/ui/sheet';

export function CasePage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cases } = trpc.case.list.useQuery();

  useEffect(() => {
    // If we're on / or /cases/ without an ID and we have cases, redirect to first case
    if (
      !id &&
      cases &&
      cases.length > 0 &&
      (location.pathname === '/' || location.pathname === '/cases/')
    ) {
      navigate(`/cases/${cases[0].id}`, { replace: true });
    }
  }, [id, cases, navigate, location.pathname]);

  return (
    <>
      <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
        <div className="hidden lg:block">
          <CaseList />
        </div>
        {id === 'new' ? (
          <CreateCasePage />
        ) : (
          <CaseDetails onMenuClick={() => setIsSheetOpen(true)} />
        )}
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="p-2">
          <CaseList onCaseClick={() => setIsSheetOpen(false)} />
        </div>
      </Sheet>
    </>
  );
}
