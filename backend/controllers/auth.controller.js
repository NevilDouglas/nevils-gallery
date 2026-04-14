// backend/controllers/auth.controller.js
// Business-logica voor authenticatie: inloggen en uitloggen.

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { User } = require('../models');

/**
 * POST /api/auth/login
 * Verifieert de credentials en retourneert een JWT als ze kloppen.
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Gebruikersnaam en wachtwoord zijn verplicht.' });
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Ongeldige inloggegevens.' });
    }

    const isAdmin = user.admin === 'true';

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id:       user.id,
        username: user.username,
        name:     user.fname || user.cname || user.username,
        isAdmin,
      },
    });
  } catch (error) {
    console.error('Fout bij inloggen:', error);
    res.status(500).json({ error: 'Serverfout bij inloggen.' });
  }
};

module.exports = { login };
