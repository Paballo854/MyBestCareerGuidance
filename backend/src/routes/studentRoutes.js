const express = require('express');
const { db } = require('../config/firebase');
const { authMiddleware } = require('../middleware/auth');

// Import ALL student controller functions
const {
  getDashboard,
  browseInstitutions,
  browseCourses,
  applyForCourse,
  getStudentApplications,
  uploadTranscripts,
  browseJobs,
  applyForJob,
  getAdmissionResults
} = require('../controllers/studentController');

const router = express.Router();

// ====================================
// DASHBOARD & PROFILE ROUTES
// ====================================

// @desc    Get student dashboard
// @route   GET /api/student/dashboard
// @access  Private (Student)
router.get('/dashboard', authMiddleware, getDashboard);

// ====================================
// INSTITUTION & COURSE BROWSING ROUTES
// ====================================

// @desc    Browse institutions in Lesotho
// @route   GET /api/student/institutions
// @access  Private (Student)
router.get('/institutions', authMiddleware, browseInstitutions);

// @desc    Browse all courses
// @route   GET /api/student/courses
// @access  Private (Student)
router.get('/courses', authMiddleware, browseCourses);

// ====================================
// COURSE APPLICATION ROUTES
// ====================================

// @desc    Apply for a course
// @route   POST /api/student/apply
// @access  Private (Student)
router.post('/apply', authMiddleware, applyForCourse);

// @desc    Get student's applications
// @route   GET /api/student/applications
// @access  Private (Student)
router.get('/applications', authMiddleware, getStudentApplications);

// @desc    Get admission results
// @route   GET /api/student/admissions
// @access  Private (Student)
router.get('/admissions', authMiddleware, getAdmissionResults);

// ====================================
// JOB & CAREER ROUTES
// ====================================

// @desc    Browse job postings
// @route   GET /api/student/jobs
// @access  Private (Student)
router.get('/jobs', authMiddleware, browseJobs);

// @desc    Apply for job
// @route   POST /api/student/apply-job
// @access  Private (Student)
router.post('/apply-job', authMiddleware, applyForJob);

// ====================================
// DOCUMENT ROUTES
// ====================================

// @desc    Upload transcripts and certificates
// @route   POST /api/student/upload-transcripts
// @access  Private (Student)
router.post('/upload-transcripts', authMiddleware, uploadTranscripts);

// @desc    Get student documents
// @route   GET /api/student/documents
// @access  Private (Student)
router.get('/documents', authMiddleware, async (req, res) => {
    try {
        const studentId = req.user.id;

        const snapshot = await db.collection('documents')
            .where('studentId', '==', studentId)
            .orderBy('uploadDate', 'desc')
            .get();

        const documents = [];
        snapshot.forEach(doc => {
            documents.push(doc.data());
        });

        res.json({
            success: true,
            documents
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch documents'
        });
    }
});

// @desc    Upload document
// @route   POST /api/student/documents/upload
// @access  Private (Student)
router.post('/documents/upload', authMiddleware, async (req, res) => {
    try {
        const { fileName, fileType, documentType } = req.body;
        const studentId = req.user.id;

        const documentData = {
            id: Date.now().toString(),
            studentId: studentId,
            fileName: fileName,
            fileType: fileType,
            documentType: documentType || 'other',
            uploadDate: new Date().toISOString(),
            status: 'pending',
            reviewNotes: ''
        };

        await db.collection('documents').doc(documentData.id).set(documentData);

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: documentData
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload document'
        });
    }
});

// @desc    Delete document
// @route   DELETE /api/student/documents/:id
// @access  Private (Student)
router.delete('/documents/:id', authMiddleware, async (req, res) => {
    try {
        const documentId = req.params.id;
        await db.collection('documents').doc(documentId).delete();

        res.json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete document'
        });
    }
});

module.exports = router;
