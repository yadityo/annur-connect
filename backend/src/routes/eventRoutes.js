// backend/src/routes/eventRoutes.js
const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *   post:
 *     summary: Create a new event (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               locationName:
 *                 type: string
 *               locationAddress:
 *                 type: string
 *               ustadz:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update event by ID (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               locationName:
 *                 type: string
 *               locationAddress:
 *                 type: string
 *               ustadz:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete event by ID (admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Event deleted
 *       404:
 *         description: Not found
 */

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