import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { ClaimDetailsPage } from './pages/ClaimDetailsPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/claims/:id" element={<ClaimDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
