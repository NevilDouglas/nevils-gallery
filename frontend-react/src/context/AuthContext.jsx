// frontend-react/src/context/AuthContext.jsx
// Globale auth-state via React Context.
// Slaat token en gebruikersinfo op in localStorage zodat de sessie een paginarefresh overleeft.

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Herstel sessie uit localStorage bij het laden van de app
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gallery_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /** Sla token + gebruikersinfo op na succesvol inloggen */
  function login(token, userData) {
    localStorage.setItem('gallery_token', token);
    localStorage.setItem('gallery_user', JSON.stringify(userData));
    setUser(userData);
  }

  /** Verwijder sessiedata bij uitloggen */
  function logout() {
    localStorage.removeItem('gallery_token');
    localStorage.removeItem('gallery_user');
    setUser(null);
  }

  const isLoggedIn = !!user;
  const isAdmin    = user?.isAdmin === true;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook voor eenvoudig gebruik van de auth-context in componenten */
export function useAuth() {
  return useContext(AuthContext);
}
