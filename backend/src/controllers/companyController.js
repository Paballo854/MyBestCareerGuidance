const { db } = require("../config/firebase");

// Get company dashboard data
const getCompanyDashboard = async (req, res) => {
    try {
        const companyId = req.user.id;
        
        // Get company data
        const companyDoc = await db.collection('companies').doc(companyId).get();
        if (!companyDoc.exists) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const companyData = companyDoc.data();

        // Get company's job postings
        const jobsSnapshot = await db.collection('jobPostings')
            .where('companyId', '==', companyId)
            .get();
        
        const jobPostings = [];
        jobsSnapshot.forEach(doc => {
            jobPostings.push({ id: doc.id, ...doc.data() });
        });

        // Get total applicants count
        const applicantsSnapshot = await db.collection('jobApplications')
            .where('companyId', '==', companyId)
            .get();

        // Get qualified applicants count (matchScore >= 70)
        const qualifiedApplicantsSnapshot = await db.collection('jobApplications')
            .where('companyId', '==', companyId)
            .where('matchScore', '>=', 70)
            .get();

        res.status(200).json({
            success: true,
            message: "Company dashboard data",
            company: companyData,
            stats: {
                totalJobs: jobPostings.length,
                totalApplicants: applicantsSnapshot.size,
                qualifiedApplicants: qualifiedApplicantsSnapshot.size,
                activeJobs: jobPostings.filter(job => job.isActive).length
            },
            features: [
                "Post Job Opportunities",
                "View Qualified Applicants",
                "Filter by Academic Performance",
                "Manage Company Profile",
                "Receive Applications for Interviews"
            ]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get company dashboard",
            error: error.message
        });
    }
};

// Post a new job opportunity
const postJob = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            requirements, 
            qualifications, 
            salary, 
            location,
            jobType,
            minGPA,
            requiredCertificates,
            minExperience,
            applicationDeadline
        } = req.body;
        
        const companyId = req.user.id;

        if (!title || !description || !requirements) {
            return res.status(400).json({
                success: false,
                message: "Title, description and requirements are required"
            });
        }

        // Get company data
        const companyDoc = await db.collection('companies').doc(companyId).get();
        if (!companyDoc.exists) {
            return res.status(404).json({ error: 'Company not found' });
        }
        const companyData = companyDoc.data();

        const jobId = `${companyId}_${title.replace(/\s+/g, '_')}_${Date.now()}`;
        
        const jobData = {
            jobId,
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : [requirements],
            qualifications: Array.isArray(qualifications) ? qualifications : [qualifications],
            salary,
            location,
            jobType: jobType || 'Full-time',
            minGPA: minGPA || 2.5,
            requiredCertificates: Array.isArray(requiredCertificates) ? requiredCertificates : [],
            minExperience: minExperience || 0,
            applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
            companyId,
            companyName: companyData.companyName || req.user.firstName,
            companyEmail: req.user.email,
            postedAt: new Date().toISOString(),
            isActive: true,
            status: 'open'
        };

        await db.collection("jobPostings").doc(jobId).set(jobData);

        // Notify qualified students about new job opportunity
        await notifyQualifiedStudents(jobData);

        res.status(201).json({
            success: true,
            message: "Job posted successfully",
            jobId,
            job: jobData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to post job",
            error: error.message
        });
    }
};

// Get company's job postings
const getJobs = async (req, res) => {
    try {
        const companyId = req.user.id;

        const jobsSnapshot = await db.collection('jobPostings')
            .where('companyId', '==', companyId)
            .orderBy('postedAt', 'desc')
            .get();
        
        const jobs = [];
        jobsSnapshot.forEach(doc => {
            jobs.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            success: true,
            jobs,
            count: jobs.length
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
};

// Get qualified applicants with advanced filtering
const getApplicants = async (req, res) => {
    try {
        const companyId = req.user.id;
        const { jobId, minMatchScore = 70 } = req.query;

        let query = db.collection('jobApplications')
            .where('companyId', '==', companyId)
            .where('matchScore', '>=', parseInt(minMatchScore));

        if (jobId) {
            query = query.where('jobId', '==', jobId);
        }

        const applicantsSnapshot = await query.orderBy('matchScore', 'desc').get();
        
        const applicants = [];
        applicantsSnapshot.forEach(doc => {
            applicants.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            success: true,
            applicants,
            count: applicants.length,
            filters: {
                jobId: jobId || 'all',
                minMatchScore: parseInt(minMatchScore)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch applicants",
            error: error.message
        });
    }
};

// Update company profile
const updateProfile = async (req, res) => {
    try {
        const companyId = req.user.id;
        const {
            companyName,
            industry,
            size,
            website,
            description,
            contactEmail,
            phone,
            address,
            foundedYear
        } = req.body;

        const updateData = {
            updatedAt: new Date().toISOString()
        };

        // Add only provided fields
        if (companyName) updateData.companyName = companyName;
        if (industry) updateData.industry = industry;
        if (size) updateData.size = size;
        if (website) updateData.website = website;
        if (description) updateData.description = description;
        if (contactEmail) updateData.contactEmail = contactEmail;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (foundedYear) updateData.foundedYear = foundedYear;

        await db.collection('companies').doc(companyId).update(updateData);

        // Also update user collection
        await db.collection('users').doc(companyId).update({
            firstName: companyName || req.user.firstName,
            updatedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Company profile updated successfully",
            company: updateData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update company profile",
            error: error.message
        });
    }
};

// Get company profile
const getProfile = async (req, res) => {
    try {
        const companyId = req.user.id;

        const companyDoc = await db.collection('companies').doc(companyId).get();
        if (!companyDoc.exists) {
            return res.status(404).json({ error: 'Company not found' });
        }

        const companyData = companyDoc.data();

        res.status(200).json({
            success: true,
            profile: companyData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch company profile",
            error: error.message
        });
    }
};

// Helper function to notify qualified students about new job
const notifyQualifiedStudents = async (jobData) => {
    try {
        // Get all students who match the job criteria
        let studentsQuery = db.collection('users').where('role', '==', 'student');
        
        const studentsSnapshot = await studentsQuery.get();
        const qualifiedStudents = [];

        for (const doc of studentsSnapshot.docs) {
            const student = { id: doc.id, ...doc.data() };
            const matchScore = calculateStudentJobMatch(student, jobData);
            
            if (matchScore >= 70) { // Only notify highly qualified students
                qualifiedStudents.push({
                    studentId: student.id,
                    studentEmail: student.email,
                    studentName: `${student.firstName} ${student.lastName}`,
                    matchScore,
                    jobId: jobData.jobId,
                    jobTitle: jobData.title,
                    notifiedAt: new Date().toISOString()
                });
            }
        }

        // Save notifications
        for (const notification of qualifiedStudents) {
            await db.collection('jobNotifications').doc(`${notification.studentId}_${notification.jobId}`).set(notification);
        }

        console.log(`Notified ${qualifiedStudents.length} qualified students about job: ${jobData.title}`);

    } catch (error) {
        console.error('Error notifying qualified students:', error);
    }
};

// Advanced student-job matching algorithm
const calculateStudentJobMatch = (student, job) => {
    let matchScore = 0;
    const weights = {
        academic: 0.3,
        experience: 0.3,
        certificates: 0.2,
        skills: 0.2
    };

    // Academic performance matching (30%)
    const studentGPA = student.gpa || 0;
    const requiredGPA = job.minGPA || 2.5;
    if (studentGPA >= requiredGPA) {
        matchScore += weights.academic * 100;
    } else {
        matchScore += weights.academic * (studentGPA / requiredGPA) * 100;
    }

    // Work experience matching (30%)
    const studentExperience = student.experience || 0;
    const requiredExperience = job.minExperience || 0;
    if (studentExperience >= requiredExperience) {
        matchScore += weights.experience * 100;
    } else {
        matchScore += weights.experience * (studentExperience / Math.max(requiredExperience, 1)) * 100;
    }

    // Certificates matching (20%)
    const studentCertificates = student.certificates || [];
    const requiredCertificates = job.requiredCertificates || [];
    if (requiredCertificates.length > 0) {
        const matchedCertificates = studentCertificates.filter(cert => 
            requiredCertificates.some(reqCert => 
                cert.toLowerCase().includes(reqCert.toLowerCase()) || 
                reqCert.toLowerCase().includes(cert.toLowerCase())
            )
        );
        matchScore += weights.certificates * (matchedCertificates.length / requiredCertificates.length) * 100;
    } else {
        matchScore += weights.certificates * 100; // No certificate requirements = full points
    }

    // Skills matching (20%)
    const studentSkills = student.skills || [];
    const jobRequirements = job.requirements || [];
    if (jobRequirements.length > 0) {
        const matchedSkills = studentSkills.filter(skill =>
            jobRequirements.some(req =>
                skill.toLowerCase().includes(req.toLowerCase()) ||
                req.toLowerCase().includes(skill.toLowerCase())
            )
        );
        matchScore += weights.skills * (matchedSkills.length / jobRequirements.length) * 100;
    } else {
        matchScore += weights.skills * 100;
    }

    return Math.min(Math.round(matchScore), 100);
};

// Get job applications for a specific job
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const companyId = req.user.id;

        // Verify the job belongs to the company
        const jobDoc = await db.collection('jobPostings').doc(jobId).get();
        if (!jobDoc.exists || jobDoc.data().companyId !== companyId) {
            return res.status(404).json({ error: 'Job not found or access denied' });
        }

        const applicationsSnapshot = await db.collection('jobApplications')
            .where('jobId', '==', jobId)
            .orderBy('matchScore', 'desc')
            .get();
        
        const applications = [];
        applicationsSnapshot.forEach(doc => {
            applications.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            success: true,
            applications,
            count: applications.length,
            job: jobDoc.data()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch job applications",
            error: error.message
        });
    }
};

module.exports = { 
    getCompanyDashboard, 
    postJob, 
    getJobs, 
    getApplicants, 
    updateProfile, 
    getProfile,
    getJobApplications
};
