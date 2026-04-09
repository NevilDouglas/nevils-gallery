// frontend-react/src/App.jsx
// Hoofdcomponent van de applicatie.
// Definieert de routerstructuur met React Router.
// Alle pagina's worden gerenderd binnen de gedeelde Layout (nav + footer).

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MainTablePage from './pages/MainTablePage';
import MaintenancePage from './pages/MaintenancePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Routes>
      {/* Gedeelde layout-wrapper met navigatie en footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />             {/* Startpagina met preview */}
        <Route path="/main-table" element={<MainTablePage />} /> {/* Tabel met alle schilderijen */}
        <Route path="/maintenance" element={<MaintenancePage />} /> {/* CRUD-beheerpagina */}
        <Route path="/about" element={<AboutPage />} />       {/* Informatiepagina */}
      </Route>
    </Routes>
  );
}
