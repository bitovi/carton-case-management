import { Routes, Route, useLocation } from 'react-router-dom';
import { FolderClosed, Users } from 'lucide-react';
import { Header } from './components/Header';
import { MenuList } from './components/MenuList';
import { CasePage } from './pages/CasePage';
import { CustomerPage } from './pages/CustomerPage';
import { trpc } from './lib/trpc';

function App() {
  const location = useLocation();
  
  const menuItems = [
    { id: 'home', label: 'Cases', path: '/cases/', icon: <FolderClosed size={20} />, isActive: location.pathname === '/' || location.pathname.startsWith('/cases') },
    { id: 'customers', label: 'Customers', path: '/customers/', icon: <Users size={20} />, isActive: location.pathname.startsWith('/customers') },
  ];
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();

  // Show loading state while fetching user
  if (isLoading) {
    return (
      <div className="h-screen bg-[#dfe2e2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if authentication fails
  if (error || !user) {
    return (
      <div className="h-screen bg-[#dfe2e2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Unauthorized</p>
          <p className="text-gray-600 text-sm">
            Make sure your server is running and your database is seeded
          </p>
        </div>
      </div>
    );
  }

  // Derive initials from user name (e.g., "Alex Morgan" -> "AM")
  const userInitials = user.name
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="h-screen bg-[#dfe2e2] flex flex-col">
      <Header userInitials={userInitials} />
      <MenuList items={menuItems} />
      <div className="flex flex-1 overflow-hidden lg:pl-[68px]">
        <main className="flex-1 lg:p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<CasePage />} />
            <Route path="/cases/" element={<CasePage />} />
            <Route path="/cases/:id" element={<CasePage />} />
            <Route path="/customers/" element={<CustomerPage />} />
            <Route path="/customers/:id" element={<CustomerPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
