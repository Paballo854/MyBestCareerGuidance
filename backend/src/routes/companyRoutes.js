const express = require("express");
const { 
    getCompanyDashboard, 
    postJob, 
    getJobs, 
    getApplicants, 
    updateProfile, 
    getProfile,
    getJobApplications
} = require("../controllers/companyController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// All routes require company authentication
router.use(authMiddleware);

// @desc    Get company dashboard
// @route   GET /api/company/dashboard
// @access  Private (Company)
router.get("/dashboard", getCompanyDashboard);

// @desc    Post a job
// @route   POST /api/company/jobs
// @access  Private (Company)
router.post("/jobs", postJob);

// @desc    Get company's job postings
// @route   GET /api/company/jobs
// @access  Private (Company)
router.get("/jobs", getJobs);

// @desc    Get qualified applicants
// @route   GET /api/company/applicants
// @access  Private (Company)
router.get("/applicants", getApplicants);

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private (Company)
router.put("/profile", updateProfile);

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private (Company)
router.get("/profile", getProfile);

// @desc    Get applications for specific job
// @route   GET /api/company/jobs/:jobId/applications
// @access  Private (Company)
router.get("/jobs/:jobId/applications", getJobApplications);

module.exports = router;
