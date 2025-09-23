// backend/src/routes/eventCategoryRoutes.js
const express = require('express');
const eventCategoryController = require('../controllers/eventCategoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route hanya untuk admin
router.use(protect, restrictTo('admin'));

router.route('/')
    .post(eventCategoryController.createCategory)
    .get(eventCategoryController.getAllCategories);

router.route('/:id')
    .delete(eventCategoryController.deleteCategory);

module.exports = router;