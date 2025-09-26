const express = require('express');
const router = express.Router();

// --- Impor Middleware ---
// Untuk proteksi rute (memastikan user adalah DKM)
const { verifyToken, isDKM } = require('../middleware/auth.middleware');
// Untuk validasi data yang masuk saat membuat/mengubah kajian
const { kajianRules, validate } = require('../middleware/validation.middleware');

// --- Impor Controller ---
// (Asumsi file controller ini akan dibuat selanjutnya)
const kajianController = require('../controllers/kajian.controller');


// =================================================================
// RUTE PUBLIK - Dapat diakses oleh siapa saja
// =================================================================

// Dapatkan semua data kajian (untuk homepage dan halaman daftar kajian)
// Path: GET /api/kajian
router.get('/', kajianController.getAllKajian);

// Dapatkan detail satu kajian berdasarkan ID
// Path: GET /api/kajian/[:id]
router.get('/:id', kajianController.getKajianById);


// =================================================================
// RUTE ADMIN - Hanya dapat diakses oleh DKM yang sudah login
// =================================================================

// Buat data kajian baru
// Path: POST /api/kajian
// Middleware akan memvalidasi data, lalu memeriksa token & peran sebelum controller dijalankan.
router.post('/', kajianRules(), validate, [verifyToken, isDKM], kajianController.createKajian);

// Update data kajian berdasarkan ID
// Path: PUT /api/kajian/[:id]
router.put('/:id', kajianRules(), validate, [verifyToken, isDKM], kajianController.updateKajian);

// Hapus data kajian berdasarkan ID
// Path: DELETE /api/kajian/[:id]
router.delete('/:id', [verifyToken, isDKM], kajianController.deleteKajian);


module.exports = router;
