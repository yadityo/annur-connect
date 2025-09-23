// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./src/routes/authRoutes'); // <- Tambahkan ini
const userRoutes = require('./src/routes/userRoutes');
const ustadzRoutes = require('./src/routes/ustadzRoutes'); // <- Tambahkan ini
const eventCategoryRoutes = require('./src/routes/eventCategoryRoutes'); // <- Tambahkan ini
const transactionCategoryRoutes = require('./src/routes/transactionCategoryRoutes'); // <- Tambahkan ini
const eventRoutes = require('./src/routes/eventRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/public', express.static('public'));

// Gunakan Routes
app.use('/api/auth', authRoutes); // <- Tambahkan ini
app.use('/api/users', userRoutes); // <- Tambahkan ini
app.use('/api/ustadz', ustadzRoutes); // <- Tambahkan ini
app.use('/api/event-categories', eventCategoryRoutes); // <- Tambahkan ini
app.use('/api/transaction-categories', transactionCategoryRoutes); // <- Tambahkan ini
app.use('/api/events', eventRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('🎉 Halo dari Backend Aplikasi Masjid!');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Berhasil terhubung ke MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Gagal terhubung ke MongoDB', err);
    });