const mongoose = require('mongoose');
const kajianCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});
module.exports = mongoose.model('KajianCategory', kajianCategorySchema);