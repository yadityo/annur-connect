const express = require('express');
const router = express.Router();

// --- Impor Middleware ---
// Mengimpor aturan validasi dan fungsi `validate` dari middleware.
const { registerRules, loginRules, validate } = require('../middleware/validation.middleware');

// --- Impor Controller ---
// Mengimpor logika untuk register dan login dari auth.controller.
// (Asumsi file controller ini akan dibuat selanjutnya).
const authController = require('../controllers/auth.controller');

// =================================================================
// RUTE UNTUK REGISTRASI PENGGUNA BARU (Jamaah)
// Path: POST /api/auth/register
// =================================================================
// 1. `registerRules()`: Menerapkan aturan validasi (nama, email, password).
// 2. `validate`: Memeriksa hasil validasi. Jika ada error, proses berhenti di sini.
// 3. `authController.register`: Jika validasi lolos, lanjutkan ke fungsi controller untuk menyimpan user.
router.post('/register', registerRules(), validate, authController.register);


// =================================================================
// RUTE UNTUK LOGIN PENGGUNA (Jamaah & DKM)
// Path: POST /api/auth/login
// =================================================================
// 1. `loginRules()`: Menerapkan aturan validasi (email, password).
// 2. `validate`: Memeriksa hasil validasi.
// 3. `authController.login`: Jika validasi lolos, lanjutkan ke fungsi controller untuk memverifikasi user.
router.post('/login', loginRules(), validate, authController.login);


module.exports = router;
