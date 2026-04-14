// frontend-react/src/components/Nav.jsx
// Navigatiecomponent bovenaan elke pagina.
// - Maintenance: alleen zichtbaar voor ingelogde admins
// - Login:       alleen zichtbaar wanneer niet ingelogd
// - Logout:      vervangt Login wanneer wel ingelogd

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <nav>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/main-table">Main Table</NavLink></li>

        {/* Maintenance alleen zichtbaar voor ingelogde admins */}
        {isAdmin && (
          <li><NavLink to="/maintenance">Maintenance</NavLink></li>
        )}

        <li><NavLink to="/about">About</NavLink></li>

        {/* Login alleen zichtbaar wanneer niet ingelogd; Logout wanneer wel ingelogd */}
        {!isLoggedIn ? (
          <li><NavLink to="/login">Login</NavLink></li>
        ) : (
          <li>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
