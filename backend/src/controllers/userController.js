// backend/src/controllers/userController.js

const User = require('../models/User');

// @desc    Update device token for push notifications
// @route   PATCH /api/users/me/device-token
exports.updateDeviceToken = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { device_token: token });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json({ status: 'success', message: 'Device token berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = (req, res) => {
    // Data req.user didapatkan dari middleware 'protect'
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
};