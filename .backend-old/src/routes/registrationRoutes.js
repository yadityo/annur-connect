// .backend-old/src/routes/registrationRoutes.js
const express = require('express');
const registrationController = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: Event registration endpoints (protected)
 */

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     summary: Get all events registered by current user
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registrations
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/registrations/{eventId}:
 *   post:
 *     summary: Register current user for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Already registered or event not found
 *   delete:
 *     summary: Cancel registration for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       204:
 *         description: Registration cancelled
 *       404:
 *         description: Registration not found
 */

// Semua rute di bawah ini wajib login, jadi kita terapkan 'protect' di awal
router.use(protect);

router.get('/my', registrationController.getMyRegistrations);

router.route('/:eventId')
    .post(registrationController.registerForEvent)
    .delete(registrationController.cancelRegistration);

module.exports = router;