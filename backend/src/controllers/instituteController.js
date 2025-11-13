const { db } = require("../config/firebase");

// Get institute dashboard data
const getInstituteDashboard = async (req, res) => {
    try {
        const instituteId = req.user.id;
        const instituteEmail = req.user.email;

        // Get institute courses count
        const coursesSnapshot = await db.collection("courses")
            .where("instituteEmail", "==", instituteEmail)
            .get();

        // Get applications count
        const applicationsSnapshot = await db.collection("applications")
            .where("institutionId", "==", instituteId)
            .get();

        // Get faculties count
        const facultiesSnapshot = await db.collection("faculties")
            .where("instituteId", "==", instituteId)
            .get();

        // Calculate stats
        const applications = [];
        applicationsSnapshot.forEach(doc => {
            applications.push(doc.data());
        });

        const totalApplications = applications.length;
        const pendingApplications = applications.filter(app => app.status === 'pending').length;
        const approvedApplications = applications.filter(app => app.status === 'approved').length;
        const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

        res.status(200).json({
            success: true,
            dashboard: {
                totalCourses: coursesSnapshot.size,
                totalFaculties: facultiesSnapshot.size,
                totalApplications: totalApplications,
                pendingApplications: pendingApplications,
                approvedApplications: approvedApplications,
                rejectedApplications: rejectedApplications,
                recentApplications: applications.slice(0, 5)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get institute dashboard",
            error: error.message
        });
    }
};

// Add new faculty
const addFaculty = async (req, res) => {
    try {
        const { name, description, dean, contactEmail, departments } = req.body;
        const instituteId = req.user.id;
        const instituteEmail = req.user.email;
        const instituteName = req.user.lastName || req.user.firstName;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Faculty name is required"
            });
        }

        const facultyData = {
            name,
            description: description || "",
            dean: dean || "",
            contactEmail: contactEmail || "",
            departments: departments || [],
            instituteId,
            instituteName,
            instituteEmail,
            createdAt: new Date(),
            isActive: true,
            totalCourses: 0
        };

        const facultyRef = await db.collection("faculties").add(facultyData);

        res.status(201).json({
            success: true,
            message: "Faculty added successfully",
            facultyId: facultyRef.id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add faculty",
            error: error.message
        });
    }
};

// Get institute faculties
const getInstituteFaculties = async (req, res) => {
    try {
        const instituteId = req.user.id;

        const facultiesSnapshot = await db.collection("faculties")
            .where("instituteId", "==", instituteId)
            .get();

        const faculties = [];
        
        for (const doc of facultiesSnapshot.docs) {
            const facultyData = doc.data();
            
            // Get courses count for this faculty
            const coursesSnapshot = await db.collection("courses")
                .where("instituteId", "==", instituteId)
                .where("facultyId", "==", doc.id)
                .get();

            faculties.push({
                id: doc.id,
                ...facultyData,
                coursesCount: coursesSnapshot.size
            });
        }

        res.status(200).json({
            success: true,
            faculties
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get faculties",
            error: error.message
        });
    }
};

// Update faculty
const updateFaculty = async (req, res) => {
    try {
        const { facultyId, name, description, dean, contactEmail, departments, isActive } = req.body;
        const instituteId = req.user.id;

        // Verify the faculty belongs to this institute
        const facultyDoc = await db.collection("faculties").doc(facultyId).get();
        if (!facultyDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        const faculty = facultyDoc.data();
        if (faculty.instituteId !== instituteId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this faculty"
            });
        }

        const updateData = {
            updatedAt: new Date()
        };

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (dean !== undefined) updateData.dean = dean;
        if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
        if (departments !== undefined) updateData.departments = departments;
        if (isActive !== undefined) updateData.isActive = isActive;

        await db.collection("faculties").doc(facultyId).update(updateData);

        res.status(200).json({
            success: true,
            message: "Faculty updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update faculty",
            error: error.message
        });
    }
};

// Delete faculty
const deleteFaculty = async (req, res) => {
    try {
        const { facultyId } = req.body;
        const instituteId = req.user.id;

        // Verify the faculty belongs to this institute
        const facultyDoc = await db.collection("faculties").doc(facultyId).get();
        if (!facultyDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        const faculty = facultyDoc.data();
        if (faculty.instituteId !== instituteId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this faculty"
            });
        }

        // Check if faculty has courses
        const coursesSnapshot = await db.collection("courses")
            .where("instituteId", "==", instituteId)
            .where("facultyId", "==", facultyId)
            .get();

        if (!coursesSnapshot.empty) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete faculty with existing courses. Please reassign or delete courses first."
            });
        }

        await db.collection("faculties").doc(facultyId).delete();

        res.status(200).json({
            success: true,
            message: "Faculty deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete faculty",
            error: error.message
        });
    }
};

// Add new course (updated to use facultyId)
const addCourse = async (req, res) => {
    try {
        const { name, description, facultyId, field, qualification, requirements, duration, fees } = req.body;
        const instituteId = req.user.id;
        const instituteEmail = req.user.email;
        const instituteName = req.user.lastName || req.user.firstName;

        if (!name || !facultyId || !field) {
            return res.status(400).json({
                success: false,
                message: "Course name, faculty, and field are required"
            });
        }

        // Verify faculty exists and belongs to institute
        const facultyDoc = await db.collection("faculties").doc(facultyId).get();
        if (!facultyDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        const faculty = facultyDoc.data();
        if (faculty.instituteId !== instituteId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to add course to this faculty"
            });
        }

        const courseData = {
            name,
            description: description || "",
            facultyId,
            facultyName: faculty.name,
            field,
            qualification: qualification || "Certificate",
            requirements: requirements || "Meet basic requirements",
            duration: duration || "4 years",
            fees: fees || "Contact for details",
            institutionId: instituteId,
            institutionName: instituteName,
            instituteEmail: instituteEmail,
            createdAt: new Date(),
            isActive: true,
            availableSeats: 50
        };

        const courseRef = await db.collection("courses").add(courseData);

        res.status(201).json({
            success: true,
            message: "Course added successfully",
            courseId: courseRef.id
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add course",
            error: error.message
        });
    }
};

// Get institute courses (updated to include faculty info)
const getInstituteCourses = async (req, res) => {
    try {
        const instituteEmail = req.user.email;

        const coursesSnapshot = await db.collection("courses")
            .where("instituteEmail", "==", instituteEmail)
            .get();

        const courses = [];
        coursesSnapshot.forEach(doc => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get courses",
            error: error.message
        });
    }
};

// Get student applications
const getStudentApplications = async (req, res) => {
    try {
        const instituteId = req.user.id;

        const applicationsSnapshot = await db.collection("applications")
            .where("institutionId", "==", instituteId)
            .get();

        const applications = [];
        
        for (const doc of applicationsSnapshot.docs) {
            const application = doc.data();
            
            // Get student details
            const studentDoc = await db.collection("users").doc(application.studentId).get();
            const student = studentDoc.data();
            
            // Get course details
            const courseDoc = await db.collection("courses").doc(application.courseId).get();
            const course = courseDoc.data();

            applications.push({
                id: doc.id,
                ...application,
                student: student ? {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email
                } : null,
                course: course ? {
                    name: course.name,
                    faculty: course.facultyName
                } : null
            });
        }

        res.status(200).json({
            success: true,
            applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get applications",
            error: error.message
        });
    }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;
        const instituteId = req.user.id;

        if (!['pending', 'approved', 'rejected', 'waitlisted'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be: pending, approved, rejected, or waitlisted"
            });
        }

        // Verify the application belongs to this institute
        const applicationDoc = await db.collection("applications").doc(applicationId).get();
        if (!applicationDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        const application = applicationDoc.data();
        if (application.institutionId !== instituteId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }

        // VALIDATION: Prevent admitting same student to multiple programs
        if (status === 'approved') {
            const studentId = application.studentId;
            
            // Check if student is already approved for another program at this institution
            const existingApprovedSnapshot = await db.collection("applications")
                .where("institutionId", "==", instituteId)
                .where("studentId", "==", studentId)
                .where("status", "==", "approved")
                .get();

            // If there's already an approved application (and it's not this one)
            if (!existingApprovedSnapshot.empty) {
                const existingApproved = existingApprovedSnapshot.docs.find(doc => doc.id !== applicationId);
                if (existingApproved) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot approve: Student is already admitted to another program at this institution. Only one program admission per student is allowed.",
                        existingAdmission: {
                            applicationId: existingApproved.id,
                            courseName: existingApproved.data().courseName
                        }
                    });
                }
            }

            // Also check if student has already accepted another institution
            const acceptedElsewhereSnapshot = await db.collection("applications")
                .where("studentId", "==", studentId)
                .where("status", "==", "accepted")
                .get();

            if (!acceptedElsewhereSnapshot.empty) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot approve: Student has already accepted admission at another institution.",
                    acceptedInstitution: acceptedElsewhereSnapshot.docs[0].data().institutionName
                });
            }
        }

        await db.collection("applications").doc(applicationId).update({
            status: status,
            updatedAt: new Date(),
            reviewedBy: req.user.email
        });

        res.status(200).json({
            success: true,
            message: "Application " + status + " successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update application status",
            error: error.message
        });
    }
};

// Update institute profile
const updateInstituteProfile = async (req, res) => {
    try {
        const { name, location, description, contactEmail, phone, website } = req.body;
        const instituteId = req.user.id;

        const updateData = {
            updatedAt: new Date()
        };

        if (name) updateData.lastName = name;
        if (location) updateData.location = location;
        if (description) updateData.description = description;
        if (contactEmail) updateData.contactEmail = contactEmail;
        if (phone) updateData.phone = phone;
        if (website) updateData.website = website;

        await db.collection("users").doc(instituteId).update(updateData);

        // Also update institution record if exists
        const institutionData = {
            name: name || req.user.lastName,
            location: location || "",
            description: description || "",
            contactEmail: contactEmail || "",
            phone: phone || "",
            website: website || "",
            updatedAt: new Date()
        };

        await db.collection("institutions").doc(instituteId).set(institutionData, { merge: true });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

// Get institute profile
const getInstituteProfile = async (req, res) => {
    try {
        const instituteId = req.user.id;

        const instituteDoc = await db.collection("users").doc(instituteId).get();
        const institutionDoc = await db.collection("institutions").doc(instituteId).get();

        const profile = {
            ...instituteDoc.data(),
            institution: institutionDoc.exists ? institutionDoc.data() : {}
        };

        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message
        });
    }
};

module.exports = {
    getInstituteDashboard,
    addFaculty,
    getInstituteFaculties,
    updateFaculty,
    deleteFaculty,
    addCourse,
    getInstituteCourses,
    getStudentApplications,
    updateApplicationStatus,
    updateInstituteProfile,
    getInstituteProfile
};
