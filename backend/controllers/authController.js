import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            role: user.role,
            perfil: user.perfil,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    console.log('Update Profile Request:', req.body);
    console.log('File:', req.file);

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;

            if (req.file) {
                user.perfil = `http://localhost:5000/uploads/${req.file.filename}`;
            } else if (req.body.perfil) {
                user.perfil = req.body.perfil;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            console.log('User Updated:', updatedUser);

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                role: updatedUser.role,
                perfil: updatedUser.perfil,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500);
        throw new Error(error.message);
    }
});

export { authUser, updateUserProfile };
