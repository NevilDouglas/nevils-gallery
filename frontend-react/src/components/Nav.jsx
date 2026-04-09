// frontend-react/src/components/Nav.jsx
// Navigatiecomponent die bovenaan elke pagina wordt weergegeven.
// Gebruikt NavLink van React Router zodat de actieve paginalink automatisch
// de 'active' CSS-klasse krijgt.

import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav>
      <ul>
        {/* 'end' zorgt dat de Home-link alleen actief is op exact het pad '/' */}
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/main-table">Main Table</NavLink></li>
        <li><NavLink to="/maintenance">Maintenance</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
    </nav>
  );
}
