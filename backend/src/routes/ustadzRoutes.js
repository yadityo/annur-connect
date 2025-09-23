// backend/src/routes/ustadzRoutes.js

const express = require('express');
const ustadzController = require('../controllers/ustadzController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route di bawah ini dilindungi dan hanya untuk admin
router.use(protect, restrictTo('admin'));

router.route('/')
    .post(ustadzController.createUstadz)
    .get(ustadzController.getAllUstadz);

router.route('/:id')
    .get(ustadzController.getUstadzById)
    .put(ustadzController.updateUstadz)
    .delete(ustadzController.deleteUstadz);

module.exports = router;