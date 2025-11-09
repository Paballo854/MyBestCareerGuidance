const express = require('express');
const { db } = require('../config/firebase');
const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get();
        const courses = [];
        
        snapshot.forEach(doc => {
            courses.push(doc.data());
        });

        res.json({
            success: true,
            courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses'
        });
    }
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const doc = await db.collection('courses').doc(courseId).get();
        
        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            course: doc.data()
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course'
        });
    }
});

module.exports = router;
