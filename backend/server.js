// backend/index.js

// 1. Import library yang dibutuhkan
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose'); // Kita akan aktifkan nanti

// 2. Inisialisasi aplikasi express
const app = express();
const PORT = process.env.PORT || 5000; // Ambil port dari .env atau gunakan 5000

// 3. Gunakan middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Mengizinkan server menerima data dalam format JSON

// 4. Definisikan route sederhana untuk tes
app.get('/', (req, res) => {
    res.send('🎉 Halo dari Backend Aplikasi Masjid!');
});

// 5. Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});