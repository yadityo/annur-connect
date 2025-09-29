const mongoose = require('mongoose');
const ustadzSchema = new mongoose.Schema({
    nama: { type: String, required: true }
});
module.exports = mongoose.model('Ustadz', ustadzSchema);

