// frontend-react/src/App.jsx
// Hoofdcomponent van de applicatie.
// Definieert de routerstructuur met React Router.
// Alle pagina's worden gerenderd binnen de gedeelde Layout (nav + footer).

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import MainTablePage from './pages/MainTablePage';
import MaintenancePage from './pages/MaintenancePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Gedeelde layout-wrapper met navigatie en footer */}
        <Route element={<Layout />}>
          <Route path="/"            element={<HomePage />} />
          <Route path="/main-table"  element={<MainTablePage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/login"       element={<LoginPage />} />

          {/* Maintenance is alleen toegankelijk voor ingelogde admins */}
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <MaintenancePage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
