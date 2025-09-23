// backend/src/controllers/transactionCategoryController.js
const TransactionCategory = require('../models/TransactionCategory');

exports.createCategory = async (req, res) => {
    try {
        const category = await TransactionCategory.create(req.body);
        res.status(201).json({ status: 'success', data: { category } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    const categories = await TransactionCategory.find();
    res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await TransactionCategory.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ status: 'fail', message: 'Kategori tidak ditemukan' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};