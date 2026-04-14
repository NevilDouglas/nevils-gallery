// frontend-react/src/components/ProtectedRoute.jsx
// Wrapper die niet-ingelogde admins doorstuurt naar de loginpagina.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
