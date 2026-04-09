import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/main-table">Main Table</NavLink></li>
        <li><NavLink to="/maintenance">Maintenance</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
    </nav>
  );
}
