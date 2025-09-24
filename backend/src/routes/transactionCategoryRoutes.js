// backend/src/routes/transactionCategoryRoutes.js
const express = require('express');
const transactionCategoryController = require('../controllers/transactionCategoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TransactionCategories
 *   description: Transaction category management endpoints (admin only)
 */

/**
 * @swagger
 * /api/transaction-categories:
 *   post:
 *     summary: Create a new transaction category
 *     tags: [TransactionCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [pemasukan, pengeluaran]
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all transaction categories
 *     tags: [TransactionCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /api/transaction-categories/{id}:
 *   delete:
 *     summary: Delete transaction category by ID
 *     tags: [TransactionCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted
 *       404:
 *         description: Not found
 */

// Semua route hanya untuk admin
router.use(protect, restrictTo('admin'));

router.route('/')
    .post(transactionCategoryController.createCategory)
    .get(transactionCategoryController.getAllCategories);

router.route('/:id')
    .delete(transactionCategoryController.deleteCategory);

module.exports = router;