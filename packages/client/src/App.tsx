import { Routes, Route } from 'react-router-dom';
import { CaseDetailsPage } from './pages/CaseDetailsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<CaseDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
