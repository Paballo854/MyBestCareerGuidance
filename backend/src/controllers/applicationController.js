const { db } = require('../config/firebase');

// Apply for a course
const applyForCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const studentEmail = req.user.email;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Check if course exists
        const courseDoc = await db.collection('courses').doc(courseId).get();
        if (!courseDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const course = courseDoc.data();

        // Check if student already applied to this course
        const existingApplication = await db.collection('applications')
            .where('studentEmail', '==', studentEmail)
            .where('courseId', '==', courseId)
            .get();

        if (!existingApplication.empty) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this course'
            });
        }

        // Check if student has reached max applications (2) for this institution
        const institutionApplications = await db.collection('applications')
            .where('studentEmail', '==', studentEmail)
            .where('institution', '==', course.institution)
            .get();

        if (institutionApplications.size >= 2) {
            return res.status(400).json({
                success: false,
                message: `You can only apply to maximum 2 courses per institution. You have already applied to ${institutionApplications.size} courses at ${course.institution}`
            });
        }

        // Check if course has available seats
        if (course.availableSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: 'This course has no available seats'
            });
        }

        // Check if application deadline has passed
        const currentDate = new Date();
        const deadline = new Date(course.applicationDeadline);
        if (currentDate > deadline) {
            return res.status(400).json({
                success: false,
                message: 'Application deadline has passed for this course'
            });
        }

        // Create application
        const application = {
            studentEmail,
            courseId,
            courseName: course.name,
            institution: course.institution,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            documents: []
        };

        const applicationRef = await db.collection('applications').add(application);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                id: applicationRef.id,
                ...application
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
};

// Get student's applications
const getStudentApplications = async (req, res) => {
    try {
        const studentEmail = req.user.email;

        const applicationsSnapshot = await db.collection('applications')
            .where('studentEmail', '==', studentEmail)
            .get();

        const applications = [];
        applicationsSnapshot.forEach(doc => {
            applications.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Sort by application date (newest first)
        applications.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));

        res.status(200).json({
            success: true,
            applications: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
};

// Get application by ID
const getApplicationById = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const studentEmail = req.user.email;

        const applicationDoc = await db.collection('applications').doc(applicationId).get();

        if (!applicationDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const application = applicationDoc.data();

        // Check if application belongs to the student
        if (application.studentEmail !== studentEmail) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            application: {
                id: applicationDoc.id,
                ...application
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: error.message
        });
    }
};

module.exports = {
    applyForCourse,
    getStudentApplications,
    getApplicationById
};
