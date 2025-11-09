const { db } = require('../config/firebase');

// Get student dashboard data - YOUR EXISTING FUNCTION
const getDashboard = async (req, res) => {
    try {
        const studentEmail = req.user.email;

        // Get student's applications
        const applicationsSnapshot = await db.collection('applications')
            .where('studentEmail', '==', studentEmail)
            .get();

        const applications = [];
        applicationsSnapshot.forEach(doc => {
            applications.push(doc.data());
        });

        const pendingApps = applications.filter(app => app.status === 'pending').length;
        const approvedApps = applications.filter(app => app.status === 'approved').length;

        res.status(200).json({
            success: true,
            dashboard: {
                totalApplications: applications.length,
                pendingApplications: pendingApps,
                approvedApplications: approvedApps,
                recentApplications: applications.slice(0, 5) // Last 5 applications
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};

// === NEW FEATURES ADDED BELOW ===

// Browse institutions in Lesotho
const browseInstitutions = async (req, res) => {
  try {
    const institutionsSnapshot = await db.collection('institutions').get();
    
    const institutions = [];
    institutionsSnapshot.forEach(doc => {
      institutions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ success: true, institutions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Browse courses with institution info
const browseCourses = async (req, res) => {
  try {
    const coursesSnapshot = await db.collection('courses').get();
    const courses = [];
    
    for (const doc of coursesSnapshot.docs) {
      const courseData = doc.data();
      
      // Get institution details
      const institutionDoc = await db.collection('institutions')
        .doc(courseData.institutionId).get();
      
      courses.push({
        id: doc.id,
        ...courseData,
        institution: institutionDoc.exists ? institutionDoc.data() : null
      });
    }
    
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply for course with business logic
const applyForCourse = async (req, res) => {
  try {
    const { courseId, institutionId } = req.body;
    const studentId = req.user.id;
    const studentEmail = req.user.email;

    // 1. Check if course exists
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // 2. Check if already applied to 2 courses in this institution
    const existingApplications = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('institutionId', '==', institutionId)
      .where('status', 'in', ['pending', 'approved'])
      .get();

    if (existingApplications.size >= 2) {
      return res.status(400).json({ 
        error: 'Maximum 2 applications per institution allowed' 
      });
    }

    // 3. Check if already applied to this specific course
    const existingCourseApp = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();

    if (!existingCourseApp.empty) {
      return res.status(400).json({ 
        error: 'Already applied to this course' 
      });
    }

    // 4. Create application
    const courseData = courseDoc.data();
    const applicationData = {
      studentId,
      studentEmail,
      courseId,
      institutionId,
      courseName: courseData.name,
      institutionName: courseData.institutionName,
      status: 'pending',
      appliedAt: new Date(),
      updatedAt: new Date()
    };

    const applicationRef = await db.collection('applications').add(applicationData);
    
    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: applicationRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student applications
const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const applicationsSnapshot = await db.collection('applications')
      .where('studentId', '==', studentId)
      .get();
    
    const applications = [];
    applicationsSnapshot.forEach(doc => {
      applications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload transcripts and certificates
const uploadTranscripts = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { transcriptUrl, certificates } = req.body;

    await db.collection('users').doc(studentId).update({
      transcriptUrl,
      certificates: certificates || [],
      hasUploadedDocuments: true,
      documentsUploadedAt: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Documents uploaded successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Browse job postings
const browseJobs = async (req, res) => {
  try {
    const jobsSnapshot = await db.collection('jobPostings')
      .where('status', '==', 'active')
      .get();
    
    const jobs = [];
    
    for (const doc of jobsSnapshot.docs) {
      const jobData = doc.data();
      
      // Get company details
      const companyDoc = await db.collection('companies')
        .doc(jobData.companyId).get();
      
      jobs.push({
        id: doc.id,
        ...jobData,
        company: companyDoc.exists ? companyDoc.data() : null
      });
    }
    
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user.id;
    const studentEmail = req.user.email;

    // Check if student has uploaded transcripts
    const studentDoc = await db.collection('users').doc(studentId).get();
    const student = studentDoc.data();

    if (!student.hasUploadedDocuments) {
      return res.status(400).json({ 
        error: 'Please upload your transcripts before applying for jobs' 
      });
    }

    // Check if already applied
    const existingApplication = await db.collection('jobApplications')
      .where('studentId', '==', studentId)
      .where('jobId', '==', jobId)
      .get();

    if (!existingApplication.empty) {
      return res.status(400).json({ 
        error: 'Already applied to this job' 
      });
    }

    // Get job details
    const jobDoc = await db.collection('jobPostings').doc(jobId).get();
    const jobData = jobDoc.data();

    // Create job application
    const jobApplication = {
      studentId,
      studentEmail,
      jobId,
      jobTitle: jobData.title,
      companyId: jobData.companyId,
      companyName: jobData.companyName,
      appliedAt: new Date(),
      status: 'pending'
    };

    await db.collection('jobApplications').add(jobApplication);
    
    res.json({ 
      success: true, 
      message: 'Job application submitted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get admission results
const getAdmissionResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const applicationsSnapshot = await db.collection('applications')
      .where('studentId', '==', studentId)
      .get();
    
    const admissions = [];
    applicationsSnapshot.forEach(doc => {
      const appData = doc.data();
      if (appData.status !== 'pending') {
        admissions.push({
          id: doc.id,
          ...appData
        });
      }
    });
    
    res.json({ success: true, admissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all functions
module.exports = {
  getDashboard,
  browseInstitutions,
  browseCourses,
  applyForCourse,
  getStudentApplications,
  uploadTranscripts,
  browseJobs,
  applyForJob,
  getAdmissionResults
};
