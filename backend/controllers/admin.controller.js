// --- Impor Model ---
const Ustadz = require('../models/ustadz.model');
const KajianCategory = require('../models/kajianCategory.model');
const TransactionCategory = require('../models/transactionCategory.model');

// =================================================================
// Controller untuk Manajemen Data Master: USTADZ
// =================================================================

// Dapatkan semua data ustadz
exports.getAllUstadz = async (req, res, next) => {
    try {
        const data = await Ustadz.find();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// Buat data ustadz baru
exports.createUstadz = async (req, res, next) => {
    try {
        const newUstadz = new Ustadz({ name: req.body.name, contact_info: req.body.contact_info });
        const savedData = await newUstadz.save();
        res.status(201).json({ message: "Data ustadz berhasil ditambahkan", data: savedData });
    } catch (error) {
        next(error);
    }
};

// Update data ustadz
exports.updateUstadz = async (req, res, next) => {
    try {
        const updatedData = await Ustadz.findByIdAndUpdate(req.params.id, { name: req.body.name, contact_info: req.body.contact_info }, { new: true });
        if (!updatedData) return res.status(404).json({ message: "Data ustadz tidak ditemukan" });
        res.status(200).json({ message: "Data ustadz berhasil diupdate", data: updatedData });
    } catch (error) {
        next(error);
    }
};

// Hapus data ustadz
exports.deleteUstadz = async (req, res, next) => {
    try {
        const deletedData = await Ustadz.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: "Data ustadz tidak ditemukan" });
        res.status(200).json({ message: "Data ustadz berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};


// =================================================================
// Controller untuk Manajemen Data Master: KATEGORI KAJIAN
// =================================================================

exports.getAllKajianCategories = async (req, res, next) => {
    try {
        const data = await KajianCategory.find();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.createKajianCategory = async (req, res, next) => {
    try {
        const newCategory = new KajianCategory({ name: req.body.name });
        const savedData = await newCategory.save();
        res.status(201).json({ message: "Kategori kajian berhasil ditambahkan", data: savedData });
    } catch (error) {
        next(error);
    }
};

exports.updateKajianCategory = async (req, res, next) => {
    try {
        const updatedData = await KajianCategory.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!updatedData) return res.status(404).json({ message: "Kategori kajian tidak ditemukan" });
        res.status(200).json({ message: "Kategori kajian berhasil diupdate", data: updatedData });
    } catch (error) {
        next(error);
    }
};

exports.deleteKajianCategory = async (req, res, next) => {
    try {
        const deletedData = await KajianCategory.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: "Kategori kajian tidak ditemukan" });
        res.status(200).json({ message: "Kategori kajian berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};


// =================================================================
// Controller untuk Manajemen Data Master: KATEGORI TRANSAKSI
// =================================================================

exports.getAllTransactionCategories = async (req, res, next) => {
    try {
        const data = await TransactionCategory.find();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

exports.createTransactionCategory = async (req, res, next) => {
    try {
        const newCategory = new TransactionCategory({ name: req.body.name });
        const savedData = await newCategory.save();
        res.status(201).json({ message: "Kategori transaksi berhasil ditambahkan", data: savedData });
    } catch (error) {
        next(error);
    }
};

exports.updateTransactionCategory = async (req, res, next) => {
    try {
        const updatedData = await TransactionCategory.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
        if (!updatedData) return res.status(404).json({ message: "Kategori transaksi tidak ditemukan" });
        res.status(200).json({ message: "Kategori transaksi berhasil diupdate", data: updatedData });
    } catch (error) {
        next(error);
    }
};

exports.deleteTransactionCategory = async (req, res, next) => {
    try {
        const deletedData = await TransactionCategory.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: "Kategori transaksi tidak ditemukan" });
        res.status(200).json({ message: "Kategori transaksi berhasil dihapus" });
    } catch (error) {
        next(error);
    }
};

