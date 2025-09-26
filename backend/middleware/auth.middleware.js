const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

/**
 * Middleware untuk memverifikasi JSON Web Token (JWT).
 * Middleware ini akan memeriksa header 'Authorization' untuk token 'Bearer'.
 * Jika token valid, ia akan mendekode payload dan menempelkan data user ke `req.user`.
 */
exports.verifyToken = (req, res, next) => {
    // Dapatkan token dari header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    // Jika tidak ada token, kirim respons error
    if (!token) {
        return res.status(403).json({ message: "Akses ditolak. Token tidak ditemukan." });
    }

    // Verifikasi token menggunakan secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
        }

        // Simpan payload yang sudah di-decode (berisi id dan role user) ke object request
        // agar bisa digunakan oleh middleware atau controller selanjutnya.
        req.user = decoded;
        next(); // Lanjutkan ke proses selanjutnya (middleware berikutnya atau controller)
    });
};

/**
 * Middleware untuk memeriksa apakah user memiliki peran 'dkm'.
 * Middleware ini HARUS dijalankan SETELAH verifyToken.
 */
exports.isDKM = async (req, res, next) => {
    try {
        // Ambil data user dari database berdasarkan ID yang ada di token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        // Periksa apakah peran user adalah 'dkm'
        if (user.role === 'dkm') {
            next(); // Jika ya, lanjutkan
        } else {
            // Jika bukan, kirim respons error
            return res.status(403).json({ message: "Akses ditolak. Hanya untuk peran DKM." });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server saat verifikasi peran.", error: error.message });
    }
};

/**
 * (Opsional) Middleware untuk memeriksa apakah user memiliki peran 'jamaah'.
 * Bisa digunakan untuk rute yang spesifik untuk jamaah.
 */
exports.isJamaah = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }

        if (user.role === 'jamaah') {
            next();
        } else {
            return res.status(403).json({ message: "Akses ditolak. Hanya untuk peran Jamaah." });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan server saat verifikasi peran.", error: error.message });
    }
};
