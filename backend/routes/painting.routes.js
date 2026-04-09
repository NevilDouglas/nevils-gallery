// backend/routes/painting.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting,
  resetPaintings
} = require('../controllers/painting.controller');

const upload = require('../middleware/upload');

const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' });
  }
  next();
};

router.get('/', getAllPaintings);
router.post('/reset', resetPaintings);
router.get('/:id', validateUUID, getPaintingById);
router.post('/', upload.single('imageFile'), createPainting);
router.put('/:id', validateUUID, upload.single('imageFile'), updatePainting);
router.delete('/:id', validateUUID, deletePainting);

module.exports = router;
