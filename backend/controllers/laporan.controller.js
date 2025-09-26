// --- Impor Model ---
const Transaction = require('../models/transaction.model');

// =================================================================
// Controller untuk Fitur Publik (Laporan Keuangan)
// =================================================================

// Dapatkan SEMUA transaksi
exports.getAllTransactions = async (req, res, next) => {
    try {
        const allTransactions = await Transaction.find()
            .sort({ date: -1 }) // Urutkan berdasarkan tanggal (terbaru lebih dulu)
            .populate('category', 'name'); // Ganti ID kategori dengan nama dari koleksi TransactionCategory

        res.status(200).json(allTransactions);
    } catch (error) {
        next(error); // Teruskan error ke error handler
    }
};

// =================================================================
// Controller untuk Fitur Admin DKM (Manajemen Keuangan)
// =================================================================

// Buat transaksi baru
exports.createTransaction = async (req, res, next) => {
    try {
        const { date, description, amount, type, category, proof_url } = req.body;

        const newTransaction = new Transaction({
            date,
            description,
            amount,
            type,
            category,
            proof_url,
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json({ message: "Transaksi baru berhasil ditambahkan", data: savedTransaction });
    } catch (error) {
        next(error);
    }
};

// Update transaksi yang sudah ada
exports.updateTransaction = async (req, res, next) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Opsi untuk mengembalikan data baru & menjalankan validator
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan untuk diupdate" });
        }

        res.status(200).json({ message: "Transaksi berhasil diupdate", data: updatedTransaction });
    } catch (error) {
        next(error);
    }
};

// Hapus sebuah transaksi
exports.deleteTransaction = async (req, res, next) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan untuk dihapus" });
        }

        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};
