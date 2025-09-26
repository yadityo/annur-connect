// .backend-old/src/controllers/eventController.js
const Event = require('../models/Event');
const User = require('../models/User'); // Import User
const admin = require('../config/firebaseConfig');

exports.createEvent = async (req, res) => {
    try {
        // Tambahkan ID admin yang sedang login sebagai pembuat acara
        req.body.createdBy = req.user.id;
        const event = await Event.create(req.body);

        const users = await User.find({ device_token: { $ne: null } });
        const tokens = users.map(user => user.device_token);

        if (tokens.length > 0) {
            // 2. Buat pesan notifikasi
            const message = {
                notification: {
                    title: 'Kajian Baru Telah Ditambahkan!',
                    body: event.title,
                },
                tokens: tokens, // Kirim ke semua token
            };

            // 3. Kirim pesan melalui FCM
            admin.messaging().sendMulticast(message)
                .then((response) => {
                    console.log('Notifikasi berhasil dikirim:', response.successCount + ' pesan');
                })
                .catch((error) => {
                    console.error('Error mengirim notifikasi:', error);
                });
        }

        res.status(201).json({ status: 'success', data: { event } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }


};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('ustadz')
            .populate('category');
        res.status(200).json({ status: 'success', results: events.length, data: { events } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('ustadz')
            .populate('category');
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Event not found' });
        }
        res.status(200).json({ status: 'success', data: { event } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Acara tidak ditemukan' });
        }
        res.status(200).json({ status: 'success', data: { event } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ status: 'fail', message: 'Acara tidak ditemukan' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Terjadi kesalahan pada server' });
    }
};