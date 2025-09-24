// backend/src/routes/eventCategoryRoutes.js
const express = require('express');
const eventCategoryController = require('../controllers/eventCategoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: EventCategories
 *   description: Event category management endpoints (admin only)
 */

/**
 * @swagger
 * /api/event-categories:
 *   post:
 *     summary: Create a new event category
 *     tags: [EventCategories]
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
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all event categories
 *     tags: [EventCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /api/event-categories/{id}:
 *   delete:
 *     summary: Delete event category by ID
 *     tags: [EventCategories]
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
    .post(eventCategoryController.createCategory)
    .get(eventCategoryController.getAllCategories);

router.route('/:id')
    .delete(eventCategoryController.deleteCategory);

module.exports = router;