// backend/src/controllers/userController.js

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