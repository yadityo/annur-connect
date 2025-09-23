// backend/src/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Judul kajian wajib diisi'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Deskripsi wajib diisi'],
    },
    startTime: {
        type: Date,
        required: [true, 'Waktu mulai wajib diisi'],
    },
    endTime: {
        type: Date,
        required: [true, 'Waktu selesai wajib diisi'],
    },
    locationName: {
        type: String,
        default: 'Masjid Jami An-Nur',
    },
    locationAddress: {
        type: String,
        default: 'Jl. Cisaranten Kulon No. 12, Bandung',
    },
    // --- RELASI DATA ---
    ustadz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ustadz', // Merujuk ke model 'Ustadz'
        required: [true, 'Ustadz pengisi wajib dipilih'],
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'EventCategory', // Merujuk ke model 'EventCategory'
        required: [true, 'Kategori acara wajib dipilih'],
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Merujuk ke admin yang membuat acara
        required: true,
    }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;