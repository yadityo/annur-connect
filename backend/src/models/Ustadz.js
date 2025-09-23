// backend/src/models/Ustadz.js

const mongoose = require('mongoose');

const ustadzSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama ustadz wajib diisi'],
        trim: true, // Menghapus spasi di awal dan akhir
    },
    bio: {
        type: String,
        default: '', // Bio bisa kosong
    },
    photo_url: {
        type: String,
        default: 'default-ustadz.jpg', // Foto default jika tidak di-upload
    }
}, { timestamps: true });

const Ustadz = mongoose.model('Ustadz', ustadzSchema);

module.exports = Ustadz;