import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/Auth/pages/LoginPage';
import DogSearchPage from './features/Dogs/pages/DogSearchPage';
import ProtectedRoute from './shared/components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <DogSearchPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/search" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
