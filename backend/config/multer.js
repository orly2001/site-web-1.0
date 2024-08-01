const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Fonction pour s'assurer que le dossier existe, sinon le créer
const ensureDirectoryExistence = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        return true;
    }
    fs.mkdirSync(dirPath, { recursive: true });
};

// Configuration du stockage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'images');
        ensureDirectoryExistence(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
