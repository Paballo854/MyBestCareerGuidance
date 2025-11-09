const express = require('express');
const { getDashboard } = require('../controllers/studentController');
const { applyForCourse, getStudentApplications, getApplicationById } = require('../controllers/applicationController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private (Student)
router.get('/dashboard', authMiddleware, getDashboard);

// @desc    Apply for a course
// @route   POST /api/student/apply
// @access  Private (Student)
router.post('/apply', authMiddleware, applyForCourse);

// @desc    Get student's applications
// @route   GET /api/student/applications
// @access  Private (Student)
router.get('/applications', authMiddleware, getStudentApplications);

// @desc    Get application by ID
// @route   GET /api/student/applications/:applicationId
// @access  Private (Student)
router.get('/applications/:applicationId', authMiddleware, getApplicationById);

module.exports = router;
