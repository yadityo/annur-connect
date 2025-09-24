// backend/src/controllers/registrationController.js
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');

// @desc    Mendaftarkan user ke sebuah event
// @route   POST /api/registrations/:eventId
exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.user.id;

        // Cek apakah event ada
        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return res.status(404).json({ status: 'fail', message: 'Acara tidak ditemukan' });
        }

        // Cek apakah sudah terdaftar sebelumnya
        const existingRegistration = await EventRegistration.findOne({ event: eventId, user: userId });
        if (existingRegistration) {
            return res.status(400).json({ status: 'fail', message: 'Anda sudah terdaftar di acara ini' });
        }

        const registration = await EventRegistration.create({ event: eventId, user: userId });
        res.status(201).json({ status: 'success', data: { registration } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// @desc    Melihat semua acara yang diikuti oleh user
// @route   GET /api/registrations/my
exports.getMyRegistrations = async (req, res) => {
    const registrations = await EventRegistration.find({ user: req.user.id }).populate({
        path: 'event',
        select: 'title startTime locationName'
    });
    res.status(200).json({ status: 'success', data: { registrations } });
};

// @desc    Membatalkan pendaftaran
// @route   DELETE /api/registrations/:eventId
exports.cancelRegistration = async (req, res) => {
    try {
        const registration = await EventRegistration.findOneAndDelete({
            event: req.params.eventId,
            user: req.user.id
        });
        if (!registration) {
            return res.status(404).json({ status: 'fail', message: 'Pendaftaran tidak ditemukan' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};