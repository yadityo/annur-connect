// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1) Cek apakah header authorization ada dan dimulai dengan 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2) Ambil token dari header (format: "Bearer tokennya_disini")
            token = req.headers.authorization.split(' ')[1];

            // 3) Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4) Cari pengguna berdasarkan id dari token, dan tempelkan ke request
            //    Kita tidak mengambil password saat query
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ status: 'fail', message: 'Pengguna tidak ditemukan.' });
            }

            next(); // Lanjutkan ke controller selanjutnya
        } catch (error) {
            res.status(401).json({ status: 'fail', message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }
    }

    if (!token) {
        res.status(401).json({ status: 'fail', message: 'Anda belum login. Silakan login untuk mendapatkan akses.' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles adalah array, contoh: ['admin'] atau ['admin', 'moderator']
        // req.user didapat dari middleware 'protect' sebelumnya
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ // 403 Forbidden
                status: 'fail',
                message: 'Anda tidak memiliki izin untuk melakukan aksi ini.'
            });
        }
        next();
    };
};