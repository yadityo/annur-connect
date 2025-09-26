// .backend-old/src/controllers/transactionController.js
const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    try {
        const transactionData = { ...req.body };
        transactionData.createdBy = req.user.id;

        // Cek jika ada file yang di-upload
        if (req.file) {
            // Bentuk URL lengkap untuk file yang di-upload
            transactionData.proof_url = `${req.protocol}://${req.get('host')}/public/uploads/proofs/${req.file.filename}`;
        }

        const transaction = await Transaction.create(transactionData);
        res.status(201).json({ status: 'success', data: { transaction } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find()
        .populate('category', 'name type')
        .sort({ date: -1 }); // Urutkan dari yang terbaru

    res.status(200).json({ status: 'success', results: transactions.length, data: { transactions } });
};

// Fungsi update dan delete bisa dibuat serupa jika diperlukan
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ status: 'fail', message: 'Transaksi tidak ditemukan' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};