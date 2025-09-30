require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const User = require('./models/User');
const Kajian = require('./models/Kajian');
const Ustadz = require('./models/Ustadz');
const Kategori = require('./models/Kategori');
const KategoriKajian = require('./models/KategoriKajian');
const KategoriTransaksi = require('./models/KategoriTransaksi');
const Transaksi = require('./models/Transaksi');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/masjid';

// Setup upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // Simpan dengan ekstensi asli
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Simple route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email sudah terdaftar.' });
    }
    const user = new User({ name, email, password, role: 'jamaah' });
    await user.save();
    res.status(201).json({ message: 'Registrasi berhasil.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal registrasi.' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email tidak ditemukan.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password salah.' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Gagal login.' });
  }
});

// Endpoint untuk mengambil seluruh user
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data user' });
  }
});

// CRUD Ustadz
app.get('/api/ustadz', async (req, res) => {
  try {
    const ustadz = await Ustadz.find();
    res.json(ustadz);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data ustadz.' });
  }
});
app.post('/api/ustadz', async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ error: 'Nama ustadz wajib diisi.' });
    const ustadz = new Ustadz({ nama });
    await ustadz.save();
    res.status(201).json(ustadz);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah ustadz.' });
  }
});
app.put('/api/ustadz/:id', async (req, res) => {
  try {
    const { nama } = req.body;
    const ustadz = await Ustadz.findByIdAndUpdate(req.params.id, { nama }, { new: true });
    if (!ustadz) return res.status(404).json({ error: 'Ustadz tidak ditemukan.' });
    res.json(ustadz);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit ustadz.' });
  }
});
app.delete('/api/ustadz/:id', async (req, res) => {
  try {
    const ustadz = await Ustadz.findByIdAndDelete(req.params.id);
    if (!ustadz) return res.status(404).json({ error: 'Ustadz tidak ditemukan.' });
    res.json({ message: 'Ustadz berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus ustadz.' });
  }
});

// CRUD Kategori Kajian
app.get('/api/kategori-kajian', async (req, res) => {
  try {
    const kategori = await KategoriKajian.find();
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data kategori kajian.' });
  }
});
app.post('/api/kategori-kajian', async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
    const kategori = new KategoriKajian({ nama });
    await kategori.save();
    res.status(201).json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah kategori kajian.' });
  }
});
app.put('/api/kategori-kajian/:id', async (req, res) => {
  try {
    const { nama } = req.body;
    const kategori = await KategoriKajian.findByIdAndUpdate(req.params.id, { nama }, { new: true });
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit kategori kajian.' });
  }
});
app.delete('/api/kategori-kajian/:id', async (req, res) => {
  try {
    const kategori = await KategoriKajian.findByIdAndDelete(req.params.id);
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kategori kajian.' });
  }
});

// CRUD Kategori Transaksi
app.get('/api/kategori-transaksi', async (req, res) => {
  try {
    const kategori = await KategoriTransaksi.find();
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data kategori transaksi.' });
  }
});
app.post('/api/kategori-transaksi', async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
    const kategori = new KategoriTransaksi({ nama });
    await kategori.save();
    res.status(201).json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah kategori transaksi.' });
  }
});
app.put('/api/kategori-transaksi/:id', async (req, res) => {
  try {
    const { nama } = req.body;
    const kategori = await KategoriTransaksi.findByIdAndUpdate(req.params.id, { nama }, { new: true });
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    res.json(kategori);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit kategori transaksi.' });
  }
});
app.delete('/api/kategori-transaksi/:id', async (req, res) => {
  try {
    const kategori = await KategoriTransaksi.findByIdAndDelete(req.params.id);
    if (!kategori) return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kategori transaksi.' });
  }
});

// CRUD Kajian
app.get('/api/kajian', async (req, res) => {
  try {
    const kajian = await Kajian.find().populate('ustadz').populate('kategori');
    res.json(kajian);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data kajian.' });
  }
});
app.post('/api/kajian', async (req, res) => {
  try {
    const { judul, ustadz, tanggal, kategori, deskripsi } = req.body;
    if (!judul || !ustadz || !tanggal || !kategori) {
      return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    const kajian = new Kajian({ judul, ustadz, tanggal, kategori, deskripsi });
    await kajian.save();
    res.status(201).json(kajian);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah kajian.' });
  }
});
app.put('/api/kajian/:id', async (req, res) => {
  try {
    const { judul, ustadz, tanggal, kategori, deskripsi } = req.body;
    const kajian = await Kajian.findByIdAndUpdate(
      req.params.id,
      { judul, ustadz, tanggal, kategori, deskripsi },
      { new: true }
    );
    if (!kajian) return res.status(404).json({ error: 'Kajian tidak ditemukan.' });
    res.json(kajian);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit kajian.' });
  }
});
app.delete('/api/kajian/:id', async (req, res) => {
  try {
    const kajian = await Kajian.findByIdAndDelete(req.params.id);
    if (!kajian) return res.status(404).json({ error: 'Kajian tidak ditemukan.' });
    res.json({ message: 'Kajian berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus kajian.' });
  }
});
app.get('/api/kajian/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Id kajian tidak valid.' });
    }
    const kajian = await Kajian.findById(req.params.id).populate('ustadz').populate('kategori');
    if (!kajian) return res.status(404).json({ error: 'Kajian tidak ditemukan.' });
    res.json(kajian);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail kajian.' });
  }
});

// CRUD Transaksi
app.get('/api/transaksi', async (req, res) => {
  try {
    const transaksi = await Transaksi.find().populate('kategori').sort({ tanggal: -1 });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data transaksi.' });
  }
});

app.post('/api/transaksi', upload.single('bukti'), async (req, res) => {
  try {
    const { tanggal, keterangan, pemasukan, pengeluaran, kategori } = req.body;
    if (!tanggal || !keterangan || !kategori) {
      return res.status(400).json({ error: 'Field wajib diisi.' });
    }
    const bukti = req.file ? `/uploads/${req.file.filename}` : '';
    const transaksi = new Transaksi({
      tanggal,
      keterangan,
      pemasukan: pemasukan || 0,
      pengeluaran: pengeluaran || 0,
      kategori,
      bukti
    });
    await transaksi.save();
    res.status(201).json(transaksi);
  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah transaksi.' });
  }
});

app.put('/api/transaksi/:id', upload.single('bukti'), async (req, res) => {
  try {
    const { tanggal, keterangan, pemasukan, pengeluaran, kategori } = req.body;
    const update = {
      tanggal,
      keterangan,
      pemasukan: pemasukan || 0,
      pengeluaran: pengeluaran || 0,
      kategori
    };
    if (req.file) update.bukti = `/uploads/${req.file.filename}`;
    const transaksi = await Transaksi.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!transaksi) return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengedit transaksi.' });
  }
});

app.delete('/api/transaksi/:id', async (req, res) => {
  try {
    const transaksi = await Transaksi.findByIdAndDelete(req.params.id);
    if (!transaksi) return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
    res.json({ message: 'Transaksi berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus transaksi.' });
  }
});

// Proxy jadwal sholat Bandung
app.get('/api/jadwal-sholat', async (req, res) => {
  try {
    const response = await fetch('https://api.myquran.com/v1/sholat/jadwal/1301/today');
    if (!response.ok) {
      console.error('Jadwal sholat fetch error:', response.status, response.statusText);
      // Fallback jadwal sholat Bandung (default)
      return res.json({
        data: {
          jadwal: {
            tanggal: new Date().toLocaleDateString('id-ID'),
            imsak: '04:27',
            subuh: '04:37',
            terbit: '05:47',
            dhuha: '06:15',
            dzuhur: '11:52',
            ashar: '15:09',
            maghrib: '17:56',
            isya: '19:05'
          }
        },
        fallback: true
      });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Jadwal sholat error:', err);
    // Fallback jadwal sholat Bandung (default)
    res.json({
      data: {
        jadwal: {
          tanggal: new Date().toLocaleDateString('id-ID'),
          imsak: '04:27',
          subuh: '04:37',
          terbit: '05:47',
          dhuha: '06:15',
          dzuhur: '11:52',
          ashar: '15:09',
          maghrib: '17:56',
          isya: '19:05'
        }
      },
      fallback: true,
      error: err.message
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
