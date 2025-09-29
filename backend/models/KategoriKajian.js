const mongoose = require('mongoose');
const kategoriKajianSchema = new mongoose.Schema({
    nama: { type: String, required: true }
});
module.exports = mongoose.model('KategoriKajian', kategoriKajianSchema);

