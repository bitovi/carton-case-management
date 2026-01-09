import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { trpc } from '@/lib/trpc';
import { CustomerList } from '@/components/CustomerList';
import { CustomerDetails } from '@/components/CustomerDetails';
import { CreateCustomerPage } from '@/pages/CreateCustomerPage';
import { Sheet } from '@/components/ui/sheet';

export function CustomerPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: customers } = trpc.customer.list.useQuery();

  useEffect(() => {
    // If we're on /customers/ without an ID and we have customers, redirect to first customer
    if (!id && customers && customers.length > 0 && location.pathname === '/customers/') {
      navigate(`/customers/${customers[0].id}`, { replace: true });
    }
  }, [id, customers, navigate, location.pathname]);

  return (
    <>
      <div className="flex gap-6 bg-[#fbfcfc] lg:rounded-lg shadow-sm h-full lg:p-6 p-4">
        <div className="hidden lg:block">
          <CustomerList />
        </div>
        {id === 'new' ? (
          <CreateCustomerPage />
        ) : (
          <CustomerDetails onMenuClick={() => setIsSheetOpen(true)} />
        )}
      </div>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="p-2">
          <CustomerList onCustomerClick={() => setIsSheetOpen(false)} />
        </div>
      </Sheet>
    </>
  );
}
