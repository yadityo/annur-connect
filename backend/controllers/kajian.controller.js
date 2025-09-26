// --- Impor Model ---
const Kajian = require('../models/kajian.model');

// =================================================================
// Controller untuk Fitur Publik (Dapat Diakses Semua Orang)
// =================================================================

// Dapatkan SEMUA kajian
exports.getAllKajian = async (req, res, next) => {
    try {
        const allKajian = await Kajian.find()
            .sort({ schedule: 1 }) // Urutkan berdasarkan jadwal (terdekat lebih dulu)
            .populate('ustadz', 'name') // Ganti ID ustadz dengan nama dari koleksi Ustadz
            .populate('category', 'name'); // Ganti ID kategori dengan nama dari koleksi KajianCategory

        res.status(200).json(allKajian);
    } catch (error) {
        next(error); // Teruskan error ke error handler
    }
};

// Dapatkan SATU kajian berdasarkan ID
exports.getKajianById = async (req, res, next) => {
    try {
        const kajian = await Kajian.findById(req.params.id)
            .populate('ustadz', 'name contact_info')
            .populate('category', 'name');

        if (!kajian) {
            return res.status(404).json({ message: "Kajian tidak ditemukan" });
        }

        res.status(200).json(kajian);
    } catch (error) {
        next(error);
    }
};

// =================================================================
// Controller untuk Fitur Admin DKM (Terproteksi)
// =================================================================

// Buat kajian baru
exports.createKajian = async (req, res, next) => {
    try {
        const { title, description, schedule, ustadz, category } = req.body;

        const newKajian = new Kajian({
            title,
            description,
            schedule,
            ustadz,
            category,
        });

        const savedKajian = await newKajian.save();
        res.status(201).json({ message: "Kajian baru berhasil dibuat", data: savedKajian });
    } catch (error) {
        next(error);
    }
};

// Update kajian yang sudah ada
exports.updateKajian = async (req, res, next) => {
    try {
        const updatedKajian = await Kajian.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Opsi untuk mengembalikan data baru & menjalankan validator
        );

        if (!updatedKajian) {
            return res.status(404).json({ message: "Kajian tidak ditemukan untuk diupdate" });
        }

        res.status(200).json({ message: "Kajian berhasil diupdate", data: updatedKajian });
    } catch (error) {
        next(error);
    }
};

// Hapus sebuah kajian
exports.deleteKajian = async (req, res, next) => {
    try {
        const deletedKajian = await Kajian.findByIdAndDelete(req.params.id);

        if (!deletedKajian) {
            return res.status(404).json({ message: "Kajian tidak ditemukan untuk dihapus" });
        }

        res.status(200).json({ message: "Kajian berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};
