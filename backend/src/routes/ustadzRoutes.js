// backend/src/routes/ustadzRoutes.js

const express = require('express');
const ustadzController = require('../controllers/ustadzController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ustadz
 *   description: Ustadz management endpoints (admin only)
 */

/**
 * @swagger
 * /api/ustadz:
 *   post:
 *     summary: Create a new ustadz
 *     tags: [Ustadz]
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
 *               bio:
 *                 type: string
 *               photo_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ustadz created
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all ustadz
 *     tags: [Ustadz]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ustadz
 */

/**
 * @swagger
 * /api/ustadz/{id}:
 *   get:
 *     summary: Get ustadz by ID
 *     tags: [Ustadz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ustadz ID
 *     responses:
 *       200:
 *         description: Ustadz details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update ustadz by ID
 *     tags: [Ustadz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ustadz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               photo_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ustadz updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete ustadz by ID
 *     tags: [Ustadz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ustadz ID
 *     responses:
 *       204:
 *         description: Ustadz deleted
 *       404:
 *         description: Not found
 */

// Public (authenticated) endpoints
router.get('/', protect, ustadzController.getAllUstadz);
router.get('/:id', protect, ustadzController.getUstadzById);

// Admin-only endpoints

router.post('/', ustadzController.createUstadz);
router.put('/:id', ustadzController.updateUstadz);
router.delete('/:id', ustadzController.deleteUstadz);

module.exports = router;