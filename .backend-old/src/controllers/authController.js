// .backend-old/src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <- TAMBAHKAN BARIS INI

// Fungsi untuk membuat token JWT
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3d' // Token berlaku selama 3 hari
    });
};

exports.register = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const user = await User.create({ fullName, email, password });
        const token = createToken(user._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 1) Cek apakah email dan password ada
    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Mohon masukkan email dan password'
        });
    }

    // 2) Cek apakah pengguna ada & password benar
    const user = await User.findOne({ email });

    // Baris ini yang sebelumnya menyebabkan error karena 'bcrypt' tidak dikenali
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Email atau password salah'
        });
    }

    // 3) Jika semua benar, kirim token ke client
    const token = createToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
};