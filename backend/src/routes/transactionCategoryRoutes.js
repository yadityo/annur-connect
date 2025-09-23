// backend/src/routes/transactionCategoryRoutes.js
const express = require('express');
const transactionCategoryController = require('../controllers/transactionCategoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua route hanya untuk admin
router.use(protect, restrictTo('admin'));

router.route('/')
    .post(transactionCategoryController.createCategory)
    .get(transactionCategoryController.getAllCategories);

router.route('/:id')
    .delete(transactionCategoryController.deleteCategory);

module.exports = router;