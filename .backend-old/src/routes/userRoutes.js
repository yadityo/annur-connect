// .backend-old/src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo  } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/users/me/device-token:
 *   patch:
 *     summary: Update device token for push notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device token updated
 *       401:
 *         description: Unauthorized
 */

// Terapkan middleware'protect' pada route ini
router.get('/me', protect, userController.getMe);

// Route baru: Terapkan 'protect' dulu, lalu 'restrictTo'
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);

router.patch('/me/device-token', protect, userController.updateDeviceToken);

module.exports = router;