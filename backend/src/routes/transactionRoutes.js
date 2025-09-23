// backend/src/routes/transactionRoutes.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig'); // Import multer

const router = express.Router();

// Rute Publik untuk melihat laporan
router.get('/', transactionController.getAllTransactions);

// Rute Admin
router.use(protect, restrictTo('admin'));

// Terapkan middleware upload.single('nama_field_file') di sini
router.post('/', upload.single('proofImage'), transactionController.createTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;