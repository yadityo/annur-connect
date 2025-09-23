// backend/src/routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo  } = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// Terapkan middleware 'protect' pada route ini
router.get('/me', protect, userController.getMe);

// Route baru: Terapkan 'protect' dulu, lalu 'restrictTo'
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);

module.exports = router;