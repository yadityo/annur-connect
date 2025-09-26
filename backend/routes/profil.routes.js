const express = require('express');
const router = express.Router();

// --- Impor Middleware ---
// verifyToken: Memastikan pengguna sudah login.
// isJamaah: Memastikan pengguna yang login adalah seorang 'jamaah', bukan DKM.
const { verifyToken, isJamaah } = require('../middleware/auth.middleware');

// --- Impor Controller ---
const profilController = require('../controllers/profil.controller');


// =================================================================
// RUTE-RUTE INI HANYA BISA DIAKSES OLEH USER YANG SUDAH LOGIN
// =================================================================

// Dapatkan daftar kajian yang diikuti oleh pengguna saat ini
// Path: GET /api/profil/kajian-saya
router.get('/kajian-saya', [verifyToken], profilController.getRegisteredKajian);


// Daftarkan pengguna saat ini ke sebuah kajian
// Path: POST /api/profil/kajian/:id/register
router.post('/kajian/:id/register', [verifyToken, isJamaah], profilController.registerForKajian);


// Batalkan pendaftaran pengguna dari sebuah kajian
// Path: DELETE /api/profil/kajian/:id/register
router.delete('/kajian/:id/register', [verifyToken, isJamaah], profilController.unregisterFromKajian);


module.exports = router;

