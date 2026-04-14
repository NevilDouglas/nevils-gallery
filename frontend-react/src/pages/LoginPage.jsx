// frontend-react/src/pages/LoginPage.jsx
// Loginpagina met wachtwoordzichtbaarheid-toggle.
// Na succesvol inloggen wordt de gebruiker doorgestuurd naar de Maintenance-pagina.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await loginRequest(username, password);
      login(token, user);
      navigate('/maintenance', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="content">
      <h1>Login</h1>

      <div className="login-card">
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Gebruikersnaam</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="username"
            autoFocus
          />

          <label htmlFor="password">Wachtwoord</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-buttons">
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Bezig...' : 'Login'}
            </button>
            <button type="button" className="login-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
