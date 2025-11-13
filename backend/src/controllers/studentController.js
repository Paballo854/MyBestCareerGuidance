const { db } = require('../config/firebase');

// Get student dashboard data
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
                recentApplications: applications.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get dashboard data',
            error: error.message
        });
    }
};

// Browse institutions
const browseInstitutions = async (req, res) => {
    try {
        const snapshot = await db.collection('institutions').get();
        const institutions = [];
        snapshot.forEach(doc => {
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

// Browse courses
const browseCourses = async (req, res) => {
    try {
        const snapshot = await db.collection('courses').get();
        const courses = [];
        
        for (const doc of snapshot.docs) {
            const courseData = doc.data();
            const institutionId = courseData.institutionId || courseData.instituteId;
            
            let institution = null;
            let institutionName = courseData.institutionName || courseData.institution;
            
            if (institutionId) {
                try {
                    const institutionDoc = await db.collection('institutions').doc(institutionId).get();
                    if (institutionDoc.exists) {
                        institution = institutionDoc.data();
                        institutionName = institution.name || institutionName;
                    }
                } catch (instError) {
                    console.error(`Error fetching institution ${institutionId}:`, instError);
                }
            }
            
            courses.push({
                id: doc.id,
                ...courseData,
                institutionId: institutionId, // Ensure institutionId is always included
                institutionName: institutionName, // Ensure institutionName is always included
                institution: institution // Include full institution object if available
            });
        }

        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enhanced Apply for course with qualification validation
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

        const courseData = courseDoc.data();

        // 2. CHECK QUALIFICATION REQUIREMENTS
        const studentDoc = await db.collection('users').doc(studentId).get();
        const studentData = studentDoc.data();
        
        const qualificationCheck = await checkStudentQualifications(studentData, courseData);
        if (!qualificationCheck.qualified) {
            return res.status(400).json({ 
                success: false,
                message: 'You do not meet the course requirements',
                details: qualificationCheck.reasons
            });
        }

        // 3. Check if already applied to 2 courses in this institution
        // Use the institutionId from course data if not provided in request
        const finalInstitutionId = institutionId || courseData.institutionId || courseData.instituteId;
        
        if (!finalInstitutionId) {
            return res.status(400).json({ 
                success: false,
                message: 'Institution ID is required for application' 
            });
        }

        const existingApplications = await db.collection('applications')
            .where('studentId', '==', studentId)
            .where('institutionId', '==', finalInstitutionId)
            .get();

        if (existingApplications.size >= 2) {
            return res.status(400).json({ 
                success: false,
                message: 'You can only apply to maximum 2 courses per institution' 
            });
        }

        // 4. Check if already applied to this specific course
        const existingCourseApplication = await db.collection('applications')
            .where('studentId', '==', studentId)
            .where('courseId', '==', courseId)
            .get();

        if (!existingCourseApplication.empty) {
            return res.status(400).json({ 
                success: false,
                message: 'You have already applied to this course' 
            });
        }

        // 5. Create application
        // Get institution name
        let institutionName = courseData.institutionName || courseData.institution || 'Unknown Institution';
        if (finalInstitutionId) {
            try {
                const instDoc = await db.collection('institutions').doc(finalInstitutionId).get();
                if (instDoc.exists) {
                    institutionName = instDoc.data().name || institutionName;
                }
            } catch (instError) {
                // Use default name if can't fetch
            }
        }

        const applicationData = {
            studentId,
            studentEmail,
            courseId,
            institutionId: finalInstitutionId,
            courseName: courseData.name || courseData.courseName,
            institutionName: institutionName,
            status: 'pending',
            appliedAt: new Date(),
            updatedAt: new Date(),
            qualificationScore: qualificationCheck.score,
            meetsRequirements: qualificationCheck.qualified
        };

        const applicationRef = await db.collection('applications').add(applicationData);

        res.json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: applicationRef.id,
            qualificationCheck: qualificationCheck
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to submit application',
            error: error.message 
        });
    }
};

// QUALIFICATION VALIDATION FUNCTION
const checkStudentQualifications = async (studentData, courseData) => {
    const result = {
        qualified: true,
        score: 0,
        reasons: [],
        metRequirements: [],
        missingRequirements: []
    };

    // 1. Check minimum academic qualifications
    if (courseData.minimumGrade) {
        const studentGrade = studentData.highSchoolGrade || studentData.academicPerformance || 0;
        if (studentGrade < courseData.minimumGrade) {
            result.qualified = false;
            result.reasons.push('Minimum grade requirement not met. Required: ' + courseData.minimumGrade + ', Your grade: ' + studentGrade);
            result.missingRequirements.push('minimum_grade');
        } else {
            result.score += 30;
            result.metRequirements.push('minimum_grade');
        }
    }

    // 2. Check required subjects
    if (courseData.requiredSubjects && courseData.requiredSubjects.length > 0) {
        const studentSubjects = studentData.subjects || [];
        const missingSubjects = courseData.requiredSubjects.filter(subject => 
            !studentSubjects.includes(subject)
        );
        
        if (missingSubjects.length > 0) {
            result.qualified = false;
            result.reasons.push('Missing required subjects: ' + missingSubjects.join(', '));
            result.missingRequirements.push('required_subjects');
        } else {
            result.score += 30;
            result.metRequirements.push('required_subjects');
        }
    }

    // 3. Check additional requirements
    if (courseData.additionalRequirements) {
        const studentCertificates = studentData.certificates || [];
        const meetsAdditional = studentCertificates.some(cert => 
            courseData.additionalRequirements.includes(cert.type)
        );
        
        if (!meetsAdditional && courseData.additionalRequirements.length > 0) {
            result.reasons.push('Missing additional requirements: ' + courseData.additionalRequirements.join(', '));
            result.missingRequirements.push('additional_requirements');
            result.score += 10;
        } else {
            result.score += 20;
            result.metRequirements.push('additional_requirements');
        }
    }

    // 4. Check work experience if required
    if (courseData.requiredExperience) {
        const studentExperience = studentData.workExperience || 0;
        if (studentExperience < courseData.requiredExperience) {
            result.reasons.push('Insufficient work experience. Required: ' + courseData.requiredExperience + ' years, Your experience: ' + studentExperience + ' years');
            result.missingRequirements.push('work_experience');
            result.score += 10;
        } else {
            result.score += 20;
            result.metRequirements.push('work_experience');
        }
    }

    // 5. Set minimum qualification score
    const minimumScore = 60;
    if (result.score < minimumScore) {
        result.qualified = false;
        result.reasons.push('Overall qualification score too low. Required: ' + minimumScore + ', Your score: ' + result.score);
    }

    return result;
};

// Get student applications
const getStudentApplications = async (req, res) => {
    try {
        const studentId = req.user.id;

        const applicationsSnapshot = await db.collection('applications')
            .where('studentId', '==', studentId)
            .orderBy('appliedAt', 'desc')
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
        const { transcripts, certificates } = req.body;

        await db.collection('users').doc(studentId).update({
            transcripts: transcripts || [],
            certificates: certificates || [],
            documentsUpdatedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Documents uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get student qualification profile
const getQualificationProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const studentDoc = await db.collection('users').doc(studentId).get();
        
        if (!studentDoc.exists) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentData = studentDoc.data();
        const qualificationProfile = {
            highSchoolGrade: studentData.highSchoolGrade,
            subjects: studentData.subjects || [],
            certificates: studentData.certificates || [],
            workExperience: studentData.workExperience || 0,
            transcripts: studentData.transcripts || [],
            overallScore: calculateOverallQualificationScore(studentData)
        };

        res.json({ success: true, profile: qualificationProfile });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Calculate overall qualification score
const calculateOverallQualificationScore = (studentData) => {
    let score = 0;
    
    if (studentData.highSchoolGrade) {
        score += Math.min(studentData.highSchoolGrade * 0.5, 50);
    }
    
    if (studentData.certificates) {
        score += Math.min(studentData.certificates.length * 5, 30);
    }
    
    if (studentData.workExperience) {
        score += Math.min(studentData.workExperience * 4, 20);
    }
    
    return Math.min(score, 100);
};

// Update student profile
const updateProfile = async (req, res) => {
    try {
        const studentId = req.user.id;
        const updateData = req.body;

        delete updateData.role;
        delete updateData.email;
        delete updateData.password;

        await db.collection('users').doc(studentId).update({
            ...updateData,
            updatedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Browse job postings
const browseJobs = async (req, res) => {
    try {
        const snapshot = await db.collection('jobPostings')
            .where('status', '==', 'active')
            .orderBy('postedAt', 'desc')
            .get();

        const jobs = [];
        snapshot.forEach(doc => {
            jobs.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch jobs',
            error: error.message 
        });
    }
};

// Apply for job
const applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;
        const studentId = req.user.id;
        const studentEmail = req.user.email;

        const jobDoc = await db.collection('jobPostings').doc(jobId).get();
        if (!jobDoc.exists) {
            return res.status(404).json({ 
                success: false,
                message: 'Job not found' 
            });
        }

        const jobData = jobDoc.data();

        const existingApplication = await db.collection('jobApplications')
            .where('studentId', '==', studentId)
            .where('jobId', '==', jobId)
            .get();

        if (!existingApplication.empty) {
            return res.status(400).json({ 
                success: false,
                message: 'You have already applied to this job' 
            });
        }

        const studentDoc = await db.collection('users').doc(studentId).get();
        const studentData = studentDoc.data();

        const jobApplication = {
            studentId,
            studentEmail,
            jobId,
            jobTitle: jobData.title,
            companyId: jobData.companyId,
            companyName: jobData.companyName,
            coverLetter: coverLetter || '',
            appliedAt: new Date(),
            status: 'pending',
            studentQualifications: {
                academicPerformance: studentData.academicPerformance,
                certificates: studentData.certificates || [],
                workExperience: studentData.workExperience || 0
            }
        };

        const applicationRef = await db.collection('jobApplications').add(jobApplication);

        res.json({
            success: true,
            message: 'Job application submitted successfully',
            applicationId: applicationRef.id
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to submit job application',
            error: error.message 
        });
    }
};

// Get admission results
const getAdmissionResults = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get all applications (including pending, approved, rejected)
        const snapshot = await db.collection('applications')
            .where('studentId', '==', studentId)
            .get();

        const admissions = [];
        const pending = [];
        
        snapshot.forEach(doc => {
            const app = {
                id: doc.id,
                ...doc.data()
            };
            
            if (app.status === 'approved') {
                admissions.push(app);
            } else {
                pending.push(app);
            }
        });

        // Check if student has multiple approved admissions
        const hasMultipleAdmissions = admissions.length > 1;

        res.json({ 
            success: true, 
            admissions,
            pending,
            hasMultipleAdmissions,
            requiresSelection: hasMultipleAdmissions
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch admission results',
            error: error.message 
        });
    }
};

// Select admission (when student has multiple admissions)
const selectAdmission = async (req, res) => {
    try {
        const { selectedApplicationId } = req.body;
        const studentId = req.user.id;
        const studentEmail = req.user.email;

        if (!selectedApplicationId) {
            return res.status(400).json({
                success: false,
                message: 'Please select an admission to accept'
            });
        }

        // Get the selected application
        const selectedAppDoc = await db.collection('applications').doc(selectedApplicationId).get();
        if (!selectedAppDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Selected application not found'
            });
        }

        const selectedApp = selectedAppDoc.data();

        // Verify it belongs to the student and is approved
        if (selectedApp.studentId !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to select this admission'
            });
        }

        if (selectedApp.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Selected application is not approved'
            });
        }

        // Get all approved applications for this student
        const allApprovedSnapshot = await db.collection('applications')
            .where('studentId', '==', studentId)
            .where('status', '==', 'approved')
            .get();

        const otherInstitutions = [];
        const selectedInstitutionId = selectedApp.institutionId;

        // Process all approved applications
        for (const doc of allApprovedSnapshot.docs) {
            const app = doc.data();
            
            if (doc.id === selectedApplicationId) {
                // Mark selected application as accepted
                await db.collection('applications').doc(doc.id).update({
                    status: 'accepted',
                    selectedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
            } else {
                // Delete from other institutions
                await db.collection('applications').doc(doc.id).update({
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    reason: 'Student selected another institution',
                    updatedAt: new Date().toISOString()
                });

                // Track other institutions for waiting list promotion
                if (app.institutionId && app.institutionId !== selectedInstitutionId) {
                    otherInstitutions.push({
                        institutionId: app.institutionId,
                        courseId: app.courseId,
                        applicationId: doc.id
                    });
                }
            }
        }

        // Promote first waiting list student for each affected institution
        for (const inst of otherInstitutions) {
            try {
                // Find first waiting list application for this course
                const waitlistSnapshot = await db.collection('applications')
                    .where('institutionId', '==', inst.institutionId)
                    .where('courseId', '==', inst.courseId)
                    .where('status', '==', 'waitlisted')
                    .orderBy('appliedAt', 'asc')
                    .limit(1)
                    .get();

                if (!waitlistSnapshot.empty) {
                    const waitlistDoc = waitlistSnapshot.docs[0];
                    await db.collection('applications').doc(waitlistDoc.id).update({
                        status: 'approved',
                        promotedFromWaitlist: true,
                        promotedAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });

                    console.log(`✅ Promoted waitlist student ${waitlistDoc.id} for institution ${inst.institutionId}`);
                }
            } catch (waitlistError) {
                console.error(`Error promoting waitlist for institution ${inst.institutionId}:`, waitlistError);
                // Continue with other institutions
            }
        }

        res.json({
            success: true,
            message: 'Admission selected successfully. You have been removed from other institutions.',
            selectedAdmission: {
                id: selectedApplicationId,
                institutionName: selectedApp.institutionName,
                courseName: selectedApp.courseName
            },
            otherInstitutionsRemoved: otherInstitutions.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to select admission',
            error: error.message
        });
    }
};

module.exports = {
    getDashboard,
    browseInstitutions,
    browseCourses,
    applyForCourse,
    getStudentApplications,
    uploadTranscripts,
    getQualificationProfile,
    checkStudentQualifications,
    updateProfile,
    browseJobs,
    applyForJob,
    getAdmissionResults,
    selectAdmission
};
