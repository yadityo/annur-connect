// backend/src/utils/multerConfig.js
const multer = require('multer');
const path = require('path');

// Tentukan lokasi penyimpanan
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/proofs/'); // Pastikan folder ini ada
    },
    filename: function (req, file, cb) {
        // Buat nama file yang unik
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Hanya file gambar (jpeg, jpg, png) yang diizinkan!'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 2 } // Batas ukuran file 2MB
});

module.exports = upload;