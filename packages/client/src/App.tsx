import { Routes, Route } from 'react-router-dom';
import { Folder } from 'lucide-react';
import { Header } from './components/Header';
import { MenuList } from './components/MenuList';
import { CasePage } from './pages/CasePage';

const menuItems = [
  { id: 'home', label: 'Cases', path: '/', icon: <Folder size={20} />, isActive: true },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:flex">
        <MenuList items={menuItems} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<CasePage />} />
            <Route path="/cases/:id" element={<CasePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
