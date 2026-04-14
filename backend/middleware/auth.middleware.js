// backend/middleware/auth.middleware.js
// Middleware voor JWT-verificatie en admin-autorisatie.

const jwt = require('jsonwebtoken');

/**
 * Verifieert het JWT-token uit de Authorization-header.
 * Zet req.user als het token geldig is; anders HTTP 401.
 */
const requireAuth = (req, res, next) => {
  const header = req.headers['authorization'];
  const token  = header && header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Niet ingelogd — token ontbreekt.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Token ongeldig of verlopen.' });
  }
};

/**
 * Vereist dat de ingelogde gebruiker admin is.
 * Gebruik altijd ná requireAuth.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Toegang geweigerd — admin vereist.' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
