// .backend-old/src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'Tanggal transaksi wajib diisi'],
    },
    description: {
        type: String,
        required: [true, 'Deskripsi wajib diisi'],
        trim: true,
    },
    amount: {
        type: Number,
        required: [true, 'Jumlah uang wajib diisi'],
    },
    proof_url: {
        type: String,
        default: null, // Bisa kosong jika tidak ada bukti
    },
    // --- RELASI DATA ---
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'TransactionCategory',
        required: [true, 'Kategori transaksi wajib dipilih'],
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;