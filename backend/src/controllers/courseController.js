const { db } = require('../config/firebase');

// Get all courses
const getCourses = async (req, res) => {
    try {
        const coursesSnapshot = await db.collection('courses').get();
        const courses = [];
        
        coursesSnapshot.forEach(doc => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json({
            success: true,
            courses: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
};

// Get course by ID
const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        const courseDoc = await db.collection('courses').doc(courseId).get();
        
        if (!courseDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course: {
                id: courseDoc.id,
                ...courseDoc.data()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch course',
            error: error.message
        });
    }
};

module.exports = { getCourses, getCourseById };
