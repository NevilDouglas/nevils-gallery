// backend/middleware/upload.js
// Multer-middleware voor het verwerken van afbeeldinguploads.
// Geüploade bestanden worden opgeslagen in public/assets/img.
// De bestandsnaam wordt uniek gemaakt met een timestamp om naamconflicten te voorkomen.

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Doelmap voor geüploade afbeeldingen — wordt aangemaakt als die nog niet bestaat
const uploadDir = 'public/assets/img';
fs.mkdirSync(uploadDir, { recursive: true });

// Configureer de schijfopslag voor Multer
const storage = multer.diskStorage({
  // Bepaal de doelmap voor het geüploade bestand
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  // Genereer een unieke bestandsnaam op basis van het huidige tijdstip
  filename: function (req, file, cb) {
    const uniqueSuffix = `painting-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

// Initialiseer Multer met de geconfigureerde schijfopslag
const upload = multer({ storage: storage });

module.exports = upload;
