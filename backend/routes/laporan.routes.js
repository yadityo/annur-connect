const express = require('express');
const router = express.Router();

// --- Impor Middleware ---
// Untuk proteksi rute (memastikan user adalah DKM)
const { verifyToken, isDKM } = require('../middleware/auth.middleware');
// Untuk validasi data yang masuk saat membuat/mengubah transaksi
const { transactionRules, validate } = require('../middleware/validation.middleware');

// --- Impor Controller ---
// (Asumsi file controller ini akan dibuat selanjutnya)
const laporanController = require('../controllers/laporan.controller');


// =================================================================
// RUTE PUBLIK - Dapat diakses oleh siapa saja
// =================================================================

// Dapatkan semua data transaksi (untuk halaman Laporan Keuangan)
// Path: GET /api/laporan
router.get('/', laporanController.getAllTransactions);


// =================================================================
// RUTE ADMIN - Hanya dapat diakses oleh DKM yang sudah login
// =================================================================

// Buat data transaksi baru
// Path: POST /api/laporan
// Middleware akan memvalidasi data, lalu memeriksa token & peran sebelum controller dijalankan.
router.post('/', transactionRules(), validate, [verifyToken, isDKM], laporanController.createTransaction);

// Update data transaksi berdasarkan ID
// Path: PUT /api/laporan/:id
router.put('/:id', transactionRules(), validate, [verifyToken, isDKM], laporanController.updateTransaction);

// Hapus data transaksi berdasarkan ID
// Path: DELETE /api/laporan/:id
router.delete('/:id', [verifyToken, isDKM], laporanController.deleteTransaction);


module.exports = router;
