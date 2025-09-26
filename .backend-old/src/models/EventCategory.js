// .backend-old/src/models/EventCategory.js
const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama kategori wajib diisi'],
        unique: true,
        trim: true,
    }
});

const EventCategory = mongoose.model('EventCategory', eventCategorySchema);
module.exports = EventCategory;