const express = require("express");
const { 
    getInstituteDashboard, 
    addCourse, 
    getInstituteCourses,
    updateCourse,
    deleteCourse,
    getStudentApplications, 
    updateApplicationStatus, 
    updateInstituteProfile,
    getInstituteProfile,
    addFaculty,
    getInstituteFaculties,
    updateFaculty,
    deleteFaculty,
    getAdmissionResults,
    getAnalytics
} = require("../controllers/instituteController");
const { authMiddleware, instituteMiddleware } = require("../middleware/auth");

const router = express.Router();

// All routes require institute authentication
router.use(authMiddleware);
router.use(instituteMiddleware);

// @desc    Get institute dashboard
// @route   GET /api/institute/dashboard
// @access  Private (Institute)
router.get("/dashboard", getInstituteDashboard);

// @desc    Get institute profile
// @route   GET /api/institute/profile
// @access  Private (Institute)
router.get("/profile", getInstituteProfile);

// @desc    Update institute profile
// @route   PUT /api/institute/profile
// @access  Private (Institute)
router.put("/profile", updateInstituteProfile);

// ====================================
// FACULTY MANAGEMENT ROUTES
// ====================================

// @desc    Add a new faculty
// @route   POST /api/institute/faculties
// @access  Private (Institute)
router.post("/faculties", addFaculty);

// @desc    Get institute faculties
// @route   GET /api/institute/faculties
// @access  Private (Institute)
router.get("/faculties", getInstituteFaculties);

// @desc    Update faculty
// @route   PUT /api/institute/faculties
// @access  Private (Institute)
router.put("/faculties", updateFaculty);

// @desc    Delete faculty
// @route   DELETE /api/institute/faculties
// @access  Private (Institute)
router.delete("/faculties", deleteFaculty);

// ====================================
// COURSE MANAGEMENT ROUTES
// ====================================

// @desc    Add a new course
// @route   POST /api/institute/courses
// @access  Private (Institute)
router.post("/courses", addCourse);

// @desc    Get institute courses
// @route   GET /api/institute/courses
// @access  Private (Institute)
router.get("/courses", getInstituteCourses);

// @desc    Update course
// @route   PUT /api/institute/courses/:id
// @access  Private (Institute)
router.put("/courses/:courseId", updateCourse);

// @desc    Delete course
// @route   DELETE /api/institute/courses/:id
// @access  Private (Institute)
router.delete("/courses/:courseId", deleteCourse);

// ====================================
// APPLICATION MANAGEMENT ROUTES
// ====================================

// @desc    Get student applications
// @route   GET /api/institute/applications
// @access  Private (Institute)
router.get("/applications", getStudentApplications);

// @desc    Update application status
// @route   PUT /api/institute/applications/status
// @access  Private (Institute)
router.put("/applications/status", updateApplicationStatus);

// @desc    Get admission results
// @route   GET /api/institute/admissions
// @access  Private (Institute)
router.get("/admissions", getAdmissionResults);

// @desc    Get analytics
// @route   GET /api/institute/analytics
// @access  Private (Institute)
router.get("/analytics", getAnalytics);

module.exports = router;
