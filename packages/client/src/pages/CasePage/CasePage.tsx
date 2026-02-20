import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CaseList } from '@/components/CaseList';
import { CaseDetails } from '@/components/CaseDetails';
import { CreateCasePage } from '@/pages/CreateCasePage';

export function CasePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cases } = trpc.case.list.useQuery();

  useEffect(() => {
    // On desktop, if we're on / or /cases/ without an ID and we have cases, redirect to first case
    // On mobile, we want to show the list first, so don't auto-redirect
    if (
      !id &&
      cases &&
      cases.length > 0 &&
      (location.pathname === '/' || location.pathname === '/cases/')
    ) {
      // Only auto-redirect on desktop (lg breakpoint is 1024px)
      if (window.innerWidth >= 1024) {
        navigate(`/cases/${cases[0].id}`, { replace: true });
      }
    }
  }, [id, cases, navigate, location.pathname]);

  return (
    <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
      <div className="hidden lg:block">
        <CaseList />
      </div>

      {/* Desktop & Mobile: Show details when ID present, or create page, or list on mobile */}
      {id === 'new' ? (
        <CreateCasePage />
      ) : id ? (
        <CaseDetails />
      ) : (
        // Mobile: Show list when no ID selected
        <div className="flex-1 lg:hidden">
          <CaseList />
        </div>
      )}
    </div>
  );
}
