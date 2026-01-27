const multer = require("multer");
const path = require("path");
const fs = require('fs');

// Ensure directory exists
const uploadDir = 'uploads/vehicules';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const uploadVehicule = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit per file
});

module.exports = uploadVehicule;
