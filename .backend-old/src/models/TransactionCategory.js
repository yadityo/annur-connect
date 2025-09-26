// .backend-old/src/models/TransactionCategory.js
const mongoose = require('mongoose');

const transactionCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama kategori wajib diisi'],
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['pemasukan', 'pengeluaran'],
        required: [true, 'Tipe kategori (pemasukan/pengeluaran) wajib diisi'],
    }
});

const TransactionCategory = mongoose.model('TransactionCategory', transactionCategorySchema);
module.exports = TransactionCategory;