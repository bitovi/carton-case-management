import { Routes, Route, Navigate } from 'react-router-dom';
import { CaseDetailsPage } from './pages/CaseDetailsPage';
import { Header } from './components/ui/Header';
import { CaseListSidebar } from './components/ui/CaseListSidebar';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <CaseListSidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/cases" replace />} />
            <Route path="/cases" element={<CaseDetailsPage />} />
            <Route path="/cases/:id" element={<CaseDetailsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
