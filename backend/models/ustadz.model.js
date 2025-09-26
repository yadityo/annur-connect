const mongoose = require('mongoose');
const ustadzSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_info: { type: String }
});
module.exports = mongoose.model('Ustadz', ustadzSchema)