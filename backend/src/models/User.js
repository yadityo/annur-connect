// backend/src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Nama lengkap wajib diisi'],
    },
    email: {
        type: String,
        required: [true, 'Email wajib diisi'],
        unique: true, // Setiap email harus unik
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password wajib diisi'],
        minlength: 6, // Minimal 6 karakter
    },
    role: {
        type: String,
        enum: ['jamaah', 'admin'], // Hanya boleh diisi 'jamaah' atau 'admin'
        default: 'jamaah',
    },
    device_token: { // Untuk push notification nanti
        type: String,
        default: null,
    }
}, { timestamps: true }); // Otomatis menambahkan createdAt dan updatedAt

// Middleware: Jalankan fungsi ini SEBELUM data pengguna disimpan
userSchema.pre('save', async function(next) {
    // Hanya hash password jika ada perubahan (atau saat pertama kali dibuat)
    if (!this.isModified('password')) return next();

    // Hashing password dengan cost factor 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;