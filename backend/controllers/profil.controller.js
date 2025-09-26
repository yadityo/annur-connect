// --- Impor Model ---
const User = require('../models/user.model');
const Kajian = require('../models/kajian.model');

// =================================================================
// Controller untuk Fitur Profil Pengguna (Jamaah)
// =================================================================

// Dapatkan semua kajian yang diikuti oleh pengguna yang sedang login
exports.getRegisteredKajian = async (req, res, next) => {
    try {
        // ID pengguna didapatkan dari token JWT yang sudah diverifikasi oleh middleware
        const userId = req.user.id;

        const user = await User.findById(userId).populate({
            path: 'registeredKajian',
            populate: [ // Lakukan populate bersarang untuk mendapatkan detail ustadz dan kategori
                { path: 'ustadz', select: 'name' },
                { path: 'category', select: 'name' }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        res.status(200).json(user.registeredKajian);
    } catch (error) {
        next(error);
    }
};

// Daftarkan pengguna ke sebuah kajian
exports.registerForKajian = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const kajianId = req.params.id; // ID kajian dari parameter URL

        // 1. Cek apakah kajiannya ada
        const kajian = await Kajian.findById(kajianId);
        if (!kajian) {
            return res.status(404).json({ message: "Kajian tidak ditemukan" });
        }

        // 2. Tambahkan ID kajian ke array 'registeredKajian' milik pengguna
        // Gunakan $addToSet untuk mencegah duplikasi (jika pengguna sudah terdaftar, tidak akan ditambahkan lagi)
        await User.findByIdAndUpdate(userId, {
            $addToSet: { registeredKajian: kajianId }
        });

        res.status(200).json({ message: "Berhasil mendaftar kajian" });
    } catch (error) {
        next(error);
    }
};

// Batalkan pendaftaran pengguna dari sebuah kajian
exports.unregisterFromKajian = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const kajianId = req.params.id; // ID kajian dari parameter URL

        // Hapus ID kajian dari array 'registeredKajian' milik pengguna
        // Gunakan $pull untuk menghapus elemen dari array
        await User.findByIdAndUpdate(userId, {
            $pull: { registeredKajian: kajianId }
        });

        res.status(200).json({ message: "Pendaftaran kajian berhasil dibatalkan" });
    } catch (error) {
        next(error);
    }
};
