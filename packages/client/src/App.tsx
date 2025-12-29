import { Routes, Route } from 'react-router-dom';
import { CasePage } from './pages/CasePage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<CasePage />} />
        <Route path="/cases/:id" element={<CasePage />} />
      </Routes>
    </div>
  );
}

export default App;
