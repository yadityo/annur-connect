const express = require('express');
const router = express.Router();

// --- Impor Middleware ---
const { verifyToken, isDKM } = require('../middleware/auth.middleware');
const { ustadzRules, categoryRules, validate } = require('../middleware/validation.middleware');

// --- Impor Controller yang BENAR ---
// Semua fungsi diimpor dari satu file admin.controller.js
const adminController = require('../controllers/admin.controller');

// =================================================================
// RUTE-RUTE INI HANYA BISA DIAKSES OLEH ADMIN DKM
// Middleware [verifyToken, isDKM] diterapkan pada semua rute di bawah ini.
// =================================================================

router.use(verifyToken, isDKM); // Terapkan middleware ke semua rute dalam file ini

// --- Rute untuk Manajemen Ustadz ---
// Path: /api/admin/ustadz
router.route('/ustadz')
    .post(ustadzRules(), validate, adminController.createUstadz)
    .get(adminController.getAllUstadz);

router.route('/ustadz/:id')
    .put(ustadzRules(), validate, adminController.updateUstadz)
    .delete(adminController.deleteUstadz);


// --- Rute untuk Manajemen Kategori Kajian ---
// Path: /api/admin/kategori-kajian
router.route('/kategori-kajian')
    .post(categoryRules(), validate, adminController.createKajianCategory)
    .get(adminController.getAllKajianCategories);

router.route('/kategori-kajian/:id')
    .put(categoryRules(), validate, adminController.updateKajianCategory)
    .delete(adminController.deleteKajianCategory);


// --- Rute untuk Manajemen Kategori Transaksi ---
// Path: /api/admin/kategori-transaksi
router.route('/kategori-transaksi')
    .post(categoryRules(), validate, adminController.createTransactionCategory)
    .get(adminController.getAllTransactionCategories);

router.route('/kategori-transaksi/:id')
    .put(categoryRules(), validate, adminController.updateTransactionCategory)
    .delete(adminController.deleteTransactionCategory);


module.exports = router;

