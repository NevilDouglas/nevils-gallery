// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'public/assets/img';

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `painting-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
