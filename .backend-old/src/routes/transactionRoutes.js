// .backend-old/src/routes/transactionRoutes.js
const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig'); // Import multer

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction endpoints
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
 *   post:
 *     summary: Create a new transaction (admin only, with file upload)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               proofImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete transaction by ID (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       204:
 *         description: Transaction deleted
 *       404:
 *         description: Not found
 */

// Rute Publik untuk melihat laporan
router.get('/', transactionController.getAllTransactions);

// Rute Admin
router.use(protect, restrictTo('admin'));

// Terapkan middleware upload.single('nama_field_file') di sini
router.post('/', upload.single('proofImage'), transactionController.createTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;