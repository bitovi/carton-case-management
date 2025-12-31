import { Routes, Route } from 'react-router-dom';
import { FolderClosed } from 'lucide-react';
import { Header } from './components/Header';
import { MenuList } from './components/MenuList';
import { CasePage } from './pages/CasePage';

const menuItems = [
  { id: 'home', label: 'Cases', path: '/cases/', icon: <FolderClosed size={20} />, isActive: true },
];

function App() {
  return (
    <div className="h-screen bg-[#dfe2e2] flex flex-col">
      <Header />
      <MenuList items={menuItems} />
      <div className="flex flex-1 overflow-hidden lg:pl-[68px]">
        <main className="flex-1 lg:p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<CasePage />} />
            <Route path="/cases/" element={<CasePage />} />
            <Route path="/cases/:id" element={<CasePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
