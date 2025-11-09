const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const instituteRoutes = require('./instituteRoutes');
const companyRoutes = require('./companyRoutes');
const adminRoutes = require('./adminRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/student', studentRoutes);
router.use('/institute', instituteRoutes);
router.use('/company', companyRoutes);
router.use('/admin', adminRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'My Best Career Guidance API is running!',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;