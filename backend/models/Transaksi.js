const mongoose = require('mongoose');
const transaksiSchema = new mongoose.Schema({
    tanggal: { type: Date, required: true },
    keterangan: { type: String, required: true },
    pemasukan: { type: Number, default: 0 },
    pengeluaran: { type: Number, default: 0 },
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'KategoriTransaksi', required: true },
    bukti: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Transaksi', transaksiSchema);

