// backend/src/controllers/ustadzController.js

const Ustadz = require('../models/Ustadz');

// @desc    Membuat data ustadz baru
// @route   POST /api/ustadz
exports.createUstadz = async (req, res) => {
    try {
        const ustadz = await Ustadz.create(req.body);
        res.status(201).json({ status: 'success', data: { ustadz } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// @desc    Mendapatkan semua data ustadz
// @route   GET /api/ustadz
exports.getAllUstadz = async (req, res) => {
    try {
        const ustadz = await Ustadz.find();
        res.status(200).json({ status: 'success', results: ustadz.length, data: { ustadz } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Mendapatkan detail satu ustadz
// @route   GET /api/ustadz/:id
exports.getUstadzById = async (req, res) => {
    try {
        const ustadz = await Ustadz.findById(req.params.id);
        if (!ustadz) {
            return res.status(404).json({ status: 'fail', message: 'Ustadz tidak ditemukan' });
        }
        res.status(200).json({ status: 'success', data: { ustadz } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};

// @desc    Memperbarui data ustadz
// @route   PUT /api/ustadz/:id
exports.updateUstadz = async (req, res) => {
    try {
        const ustadz = await Ustadz.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Mengembalikan dokumen yang sudah diperbarui
            runValidators: true,
        });
        if (!ustadz) {
            return res.status(404).json({ status: 'fail', message: 'Ustadz tidak ditemukan' });
        }
        res.status(200).json({ status: 'success', data: { ustadz } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// @desc    Menghapus data ustadz
// @route   DELETE /api/ustadz/:id
exports.deleteUstadz = async (req, res) => {
    try {
        const ustadz = await Ustadz.findByIdAndDelete(req.params.id);
        if (!ustadz) {
            return res.status(404).json({ status: 'fail', message: 'Ustadz tidak ditemukan' });
        }
        res.status(204).json({ status: 'success', data: null }); // 204 No Content
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};