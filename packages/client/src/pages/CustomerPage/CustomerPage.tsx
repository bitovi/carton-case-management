import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CustomerList } from '@/components/CustomerList';
import { CustomerDetails } from '@/components/CustomerDetails';
import { CreateCustomerPage } from '@/pages/CreateCustomerPage';

export function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: customers } = trpc.customer.list.useQuery();

  useEffect(() => {
    // On desktop, if we're on /customers/ without an ID and we have customers, redirect to first customer
    // On mobile, we want to show the list first, so don't auto-redirect
    if (!id && customers && customers.length > 0 && location.pathname === '/customers/') {
      // Only auto-redirect on desktop (lg breakpoint is 1024px)
      if (window.innerWidth >= 1024) {
        navigate(`/customers/${customers[0].id}`, { replace: true });
      }
    }
  }, [id, customers, navigate, location.pathname]);

  return (
    <div className="w-full lg:flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm min-h-full lg:p-6 p-4 overflow-x-hidden">
      <div className="hidden lg:block">
        <CustomerList />
      </div>

      {/* Desktop & Mobile: Show details when ID present, or create page, or list on mobile */}
      {id === 'new' ? (
        <CreateCustomerPage />
      ) : id ? (
        <CustomerDetails />
      ) : (
        // Mobile: Show list when no ID selected
        <div className="flex-1 lg:hidden">
          <CustomerList />
        </div>
      )}
    </div>
  );
}
