const mongoose = require('mongoose');

const kajianSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    ustadz: { type: mongoose.Schema.Types.ObjectId, ref: 'Ustadz', required: true },
    tanggal: { type: Date, required: true },
    kategori: { type: mongoose.Schema.Types.ObjectId, ref: 'KategoriKajian', required: true },
    deskripsi: { type: String }
});

module.exports = mongoose.model('Kajian', kajianSchema);
