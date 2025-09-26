// models/transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['pemasukan', 'pengeluaran'],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransactionCategory',
        required: true,
    },
    proof_url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);