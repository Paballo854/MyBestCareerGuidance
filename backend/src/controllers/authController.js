const User = require('../models/User');
const { validateEmail } = require('../utils/helpers');

const register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;

        // Validation
        if (!email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Allow admin role for development
        const validRoles = ['student', 'institute', 'company', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be: student, institute, company, or admin'
            });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user (automatically verified)
        const user = new User({
            email,
            password,
            role,
            firstName,
            lastName
        });

        const result = await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully. You can now login.',
            user: {
                email: result.user.email,
                role: result.user.role,
                isVerified: true
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await User.verifyCredentials(email, password);

        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.user,
            token: result.token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const { password, ...userData } = user;

        res.status(200).json({
            success: true,
            user: userData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};