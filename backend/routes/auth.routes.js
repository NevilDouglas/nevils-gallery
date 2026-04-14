// backend/routes/auth.routes.js
// Authenticatie-routes: inloggen.

const express = require('express');
const router  = express.Router();
const { login } = require('../controllers/auth.controller');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inloggen als gebruiker
 *     tags: [Authenticatie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: geheim123
 *     responses:
 *       200:
 *         description: Succesvol ingelogd — JWT token teruggegeven
 *       400:
 *         description: Velden ontbreken
 *       401:
 *         description: Ongeldige inloggegevens
 *       500:
 *         description: Serverfout
 */
router.post('/login', login);

module.exports = router;
