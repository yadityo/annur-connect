// backend/src/routes/eventRoutes.js
const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// --- Rute Publik (Bisa diakses siapa saja) ---
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// --- Rute Admin (Harus login sebagai admin) ---
// Menerapkan middleware hanya untuk rute di bawah ini
router.use(protect, restrictTo('admin'));

router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;