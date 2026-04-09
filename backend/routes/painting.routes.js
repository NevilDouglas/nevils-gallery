// backend/routes/painting.routes.js
// Definieert alle HTTP-routes voor de schilderijen-API.
// Elke route is gedocumenteerd met @swagger JSDoc-annotaties voor de Swagger UI op /api-docs.

const express = require('express');
const router = express.Router();
const {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings,
} = require('../controllers/painting.controller');

const upload = require('../middleware/upload');

/**
 * Middleware: valideert of de opgegeven :id een geldige UUID is.
 * Geeft HTTP 400 terug als het formaat ongeldig is.
 */
const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};

/**
 * @swagger
 * /api/paintings:
 *   get:
 *     summary: Haal alle schilderijen op
 *     description: Geeft een lijst van alle schilderijen gesorteerd op ranking (oplopend).
 *     tags: [Schilderijen]
 *     responses:
 *       200:
 *         description: Lijst van schilderijen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Painting'
 *       500:
 *         description: Serverfout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllPaintings);

/**
 * @swagger
 * /api/paintings/reset:
 *   post:
 *     summary: Reset de dataset naar de originele 20 schilderijen
 *     description: >
 *       Verwijdert alle door gebruikers toegevoegde schilderijen (inclusief hun afbeeldingen)
 *       en herstelt de collectie naar de originele 20 meesterwerken.
 *     tags: [Schilderijen]
 *     responses:
 *       200:
 *         description: Dataset succesvol gereset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database is succesvol gereset naar de originele 20 schilderijen.
 *       500:
 *         description: Serverfout bij resetten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reset', resetPaintings);

/**
 * @swagger
 * /api/paintings/{id}:
 *   get:
 *     summary: Haal één schilderij op via ID
 *     tags: [Schilderijen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID van het schilderij
 *     responses:
 *       200:
 *         description: Het gevonden schilderij
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Painting'
 *       400:
 *         description: Ongeldig UUID-formaat
 *       404:
 *         description: Schilderij niet gevonden
 *       500:
 *         description: Serverfout
 */
router.get('/:id', validateUUID, getPaintingById);

/**
 * @swagger
 * /api/paintings:
 *   post:
 *     summary: Voeg een nieuw schilderij toe
 *     description: >
 *       Maakt een nieuw schilderij aan. Als een ranking wordt opgegeven, worden
 *       alle bestaande schilderijen met een gelijke of hogere ranking automatisch
 *       één positie opgeschoven.
 *     tags: [Schilderijen]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, artist, description]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Titel van het schilderij
 *               artist:
 *                 type: string
 *                 description: Naam van de kunstenaar
 *               ranking:
 *                 type: integer
 *                 description: Rangschikking (optioneel)
 *               description:
 *                 type: string
 *                 description: Beschrijving van het schilderij
 *               imageFile:
 *                 type: string
 *                 format: binary
 *                 description: Afbeeldingsbestand (optioneel)
 *     responses:
 *       201:
 *         description: Schilderij succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Painting'
 *       500:
 *         description: Serverfout
 */
router.post('/', upload.single('imageFile'), createPainting);

/**
 * @swagger
 * /api/paintings/{id}:
 *   put:
 *     summary: Werk een bestaand schilderij bij
 *     description: >
 *       Werkt de velden van een bestaand schilderij bij. Als de ranking verandert,
 *       worden andere schilderijen automatisch verschoven om de volgorde consistent te houden.
 *     tags: [Schilderijen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID van het bij te werken schilderij
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               artist:
 *                 type: string
 *               ranking:
 *                 type: integer
 *               description:
 *                 type: string
 *               imageFile:
 *                 type: string
 *                 format: binary
 *                 description: Nieuwe afbeelding (optioneel — vervangt de huidige)
 *     responses:
 *       200:
 *         description: Bijgewerkt schilderij
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Painting'
 *       400:
 *         description: Ongeldig UUID-formaat
 *       404:
 *         description: Schilderij niet gevonden
 *       500:
 *         description: Serverfout
 */
router.put('/:id', validateUUID, upload.single('imageFile'), updatePainting);

/**
 * @swagger
 * /api/paintings/{id}:
 *   delete:
 *     summary: Verwijder een schilderij
 *     description: >
 *       Verwijdert het schilderij uit de database. Als het schilderij een
 *       geüploade afbeelding heeft (geen initieel schilderij), wordt de afbeelding
 *       ook van de server verwijderd.
 *     tags: [Schilderijen]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID van het te verwijderen schilderij
 *     responses:
 *       204:
 *         description: Schilderij succesvol verwijderd (geen inhoud)
 *       400:
 *         description: Ongeldig UUID-formaat
 *       404:
 *         description: Schilderij niet gevonden
 *       500:
 *         description: Serverfout
 */
router.delete('/:id', validateUUID, deletePainting);

module.exports = router;
