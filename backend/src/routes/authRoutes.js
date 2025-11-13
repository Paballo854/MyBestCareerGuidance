const express = require('express');
const router = express.Router();

// Import the entire modules
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/check-email', authController.checkEmailAndSendCode);
router.post('/verify-pre-registration', authController.verifyPreRegistrationEmail);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationCode);

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