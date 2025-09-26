const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =================================================================
// Controller untuk Registrasi Pengguna Baru
// =================================================================
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Cek apakah email sudah terdaftar
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: "Email sudah terdaftar. Silakan gunakan email lain." }); // 409 Conflict
        }

        // 2. Buat user baru
        // Password akan di-hash secara otomatis oleh hook 'pre-save' di model User
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password,
            role, // role bisa 'dkm' jika didaftarkan manual, atau default 'jamaah'
        });

        // 3. Simpan user ke database
        await newUser.save();

        res.status(201).json({ message: "Registrasi berhasil. Silakan login." });

    } catch (error) {
        // Teruskan error ke errorHandler middleware
        next(error);
    }
};

// =================================================================
// Controller untuk Login Pengguna
// =================================================================
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Email atau password salah." }); // 401 Unauthorized
        }

        // 2. Bandingkan password yang diinput dengan password di database
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Email atau password salah." });
        }

        // 3. Jika password cocok, buat JSON Web Token (JWT)
        const token = jwt.sign(
            { id: user._id, role: user.role }, // Payload token
            process.env.JWT_SECRET,             // Kunci rahasia dari file .env
            { expiresIn: '24h' }                // Token akan kedaluwarsa dalam 24 jam
        );

        // 4. Kirim token dan data user (tanpa password) ke client
        res.status(200).json({
            message: "Login berhasil",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        next(error);
    }
};
