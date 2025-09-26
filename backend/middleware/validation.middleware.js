const { body, validationResult } = require('express-validator');

// =================================================================
// Aturan Validasi
// =================================================================

// Aturan untuk registrasi pengguna baru
exports.registerRules = () => [
    body('name', 'Nama tidak boleh kosong').notEmpty().trim().escape(),
    body('email', 'Format email tidak valid').isEmail().normalizeEmail(),
    body('password', 'Password minimal harus 6 karakter').isLength({ min: 6 }),
];

// Aturan untuk login
exports.loginRules = () => [
    body('email', 'Format email tidak valid').isEmail().normalizeEmail(),
    body('password', 'Password tidak boleh kosong').notEmpty(),
];

// Aturan untuk membuat/update data kajian
exports.kajianRules = () => [
    body('title', 'Judul kajian tidak boleh kosong').notEmpty().trim().escape(),
    body('description', 'Deskripsi tidak boleh kosong').notEmpty().trim().escape(),
    body('schedule', 'Jadwal tidak valid').isISO8601().toDate(),
    body('ustadz', 'ID Ustadz tidak valid').isMongoId(),
    body('category', 'ID Kategori tidak valid').isMongoId(),
];

// Aturan untuk membuat/update data transaksi
exports.transactionRules = () => [
    body('date', 'Tanggal tidak valid').isISO8601().toDate(),
    body('description', 'Deskripsi tidak boleh kosong').notEmpty().trim().escape(),
    body('amount', 'Jumlah harus berupa angka').isNumeric(),
    body('type', 'Tipe transaksi tidak valid').isIn(['pemasukan', 'pengeluaran']),
    body('category', 'ID Kategori tidak valid').isMongoId(),
];

// Aturan untuk membuat/update data ustadz
exports.ustadzRules = () => [
    body('name', 'Nama ustadz tidak boleh kosong').notEmpty().trim().escape(),
    body('contact_info', 'Info kontak tidak valid').optional().trim().escape()
];

// Aturan untuk membuat/update kategori (bisa dipakai untuk semua jenis kategori)
exports.categoryRules = () => [
    body('name', 'Nama kategori tidak boleh kosong').notEmpty().trim().escape(),
];


// =================================================================
// Middleware Validator
// =================================================================

// Fungsi middleware yang akan menjalankan validasi
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next(); // Jika tidak ada error, lanjutkan ke controller
    }

    // Jika ada error, kumpulkan pesan errornya
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    // Kirim respons error 422 (Unprocessable Entity)
    return res.status(422).json({
        errors: extractedErrors,
    });
};

