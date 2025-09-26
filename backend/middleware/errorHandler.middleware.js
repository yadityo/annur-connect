/**
 * Middleware untuk menangani semua error yang terjadi di aplikasi secara terpusat.
 * Ini harus menjadi middleware TERAKHIR yang digunakan di file server.js Anda.
 * * @param {Error} err - Objek error yang dilempar dari controller atau middleware sebelumnya.
 * @param {import('express').Request} req - Objek request Express.
 * @param {import('express').Response} res - Objek response Express.
 * @param {import('express').NextFunction} next - Fungsi next Express.
 */
const errorHandler = (err, req, res, next) => {
    // Mencatat error ke konsol untuk keperluan debugging di sisi server.
    // Pada aplikasi produksi, ini bisa diganti dengan layanan logging seperti Winston atau Sentry.
    console.error(err.stack);

    // Menentukan status code dari error. Jika error sudah memiliki statusCode, gunakan itu.
    // Jika tidak, default ke 500 (Internal Server Error).
    const statusCode = err.statusCode || 500;

    // Mengirim respons error dalam format JSON yang konsisten ke client/frontend.
    res.status(statusCode).json({
        message: err.message || 'Terjadi kesalahan pada server.',
        // Untuk tujuan keamanan, kita hanya mengirim detail 'stack' error
        // jika aplikasi berjalan dalam mode development.
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
