// frontend-react/src/components/Layout.jsx
// Gedeelde lay-outcomponent die de navigatie en footer omhult.
// Alle pagina's worden via <Outlet /> gerenderd tussen de nav en footer.
// Dit component wordt als wrapper gebruikt in de React Router routestructuur.

import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet /> {/* Hier wordt de actieve pagina-component gerenderd */}
      <Footer />
    </>
  );
}
