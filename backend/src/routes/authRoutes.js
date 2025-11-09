const express = require('express');
const router = express.Router();

// Import the entire modules
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authMiddleware.authMiddleware, authController.getProfile);

// Test protected route
router.get('/protected', authMiddleware.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Access granted to protected route',
        user: req.user
    });
});

module.exports = router;