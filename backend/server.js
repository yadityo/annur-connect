require('dotenv').config(); // Memuat variabel lingkungan dari file .env di awal
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Impor Routes ---
const authRoutes = require('./routes/auth.routes');
const kajianRoutes = require('./routes/kajian.routes');
const laporanRoutes = require('./routes/laporan.routes');
const profilRoutes = require('./routes/profil.routes');
const adminRoutes = require('./routes/admin.routes');

// --- Impor Middlewares ---
const errorHandler = require('./middleware/errorHandler.middleware');

// Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// --- Konfigurasi Middleware ---
app.use(cors()); // Mengizinkan permintaan dari domain/port lain (misal: frontend React)
app.use(express.json()); // Mem-parsing body request yang masuk sebagai JSON
app.use(express.urlencoded({ extended: true })); // Mem-parsing body request dari form URL-encoded

// --- Koneksi ke Database MongoDB ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB.'))
    .catch(err => {
        console.error('Koneksi database gagal:', err);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    });

// --- Penggunaan Routes ---
// Setiap permintaan ke URL yang diawali dengan path ini akan diarahkan ke file route yang sesuai
app.use('/api/auth', authRoutes);
app.use('/api/kajian', kajianRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/admin', adminRoutes);

// Route dasar untuk mengecek apakah server berjalan
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Selamat Datang di API Server DKM Al-Hikmah' });
});

// --- Middleware Penanganan Error (Harus di bagian paling akhir) ---
app.use(errorHandler);

// --- Menjalankan Server ---
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
