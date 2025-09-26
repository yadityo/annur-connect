// models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Email tidak boleh sama
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['jamaah', 'dkm'], // Hanya boleh diisi 'jamaah' atau 'dkm'
        default: 'jamaah',
    },
    // Menyimpan ID dari kajian yang diikuti oleh user
    registeredKajian: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kajian' // Mereferensikan ke model 'Kajian'
    }]
}, { timestamps: true }); // Otomatis menambahkan createdAt dan updatedAt

// Hook yang berjalan SEBELUM data disimpan (.save())
userSchema.pre('save', async function(next) {
    // Hanya hash password jika field password diubah
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;