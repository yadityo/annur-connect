const mongoose = require('mongoose');
const kategoriTransaksiSchema = new mongoose.Schema({
    nama: { type: String, required: true }
});
module.exports = mongoose.model('KategoriTransaksi', kategoriTransaksiSchema);

