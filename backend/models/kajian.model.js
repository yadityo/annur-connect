// models/kajian.model.js
const mongoose = require('mongoose');

const kajianSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    schedule: { type: Date, required: true },
    // Relasi ke model lain
    ustadz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ustadz', // Harus sama dengan nama model Ustadz
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KajianCategory',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Kajian', kajianSchema);