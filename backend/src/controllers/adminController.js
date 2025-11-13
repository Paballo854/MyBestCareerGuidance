const { db } = require("../config/firebase");

const getAdminDashboard = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Admin dashboard data",
            admin: req.user,
            features: [
                "Manage All Institutions",
                "Approve/Suspend Companies",
                "Monitor System Reports",
                "Manage All Users",
                "System Configuration"
            ],
            stats: {
                totalUsers: 0,
                totalInstitutions: 0,
                totalCompanies: 0,
                totalApplications: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get admin dashboard",
            error: error.message
        });
    }
};

const manageInstitution = async (req, res) => {
    try {
        const { action, institutionId } = req.body;

        if (!action || !institutionId) {
            return res.status(400).json({
                success: false,
                message: "Action and institution ID are required"
            });
        }

        res.status(200).json({
            success: true,
            message: `Institution ${action} successfully`,
            institutionId
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to manage institution",
            error: error.message
        });
    }
};

// Get all companies for admin management
const manageCompanies = async (req, res) => {
    try {
        const companiesSnapshot = await db.collection('companies').get();
        const companies = [];
        
        companiesSnapshot.forEach(doc => {
            companies.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch companies",
            error: error.message
        });
    }
};

// Approve a company
const approveCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        await db.collection('companies').doc(companyId).update({
            status: 'approved',
            updatedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Company approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to approve company",
            error: error.message
        });
    }
};

// Suspend a company
const suspendCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        await db.collection('companies').doc(companyId).update({
            status: 'suspended',
            updatedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Company suspended successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to suspend company",
            error: error.message
        });
    }
};

// Get system reports
const getReports = async (req, res) => {
    try {
        // Get basic system statistics
        const usersSnapshot = await db.collection('users').get();
        const institutionsSnapshot = await db.collection('institutions').get();
        const companiesSnapshot = await db.collection('companies').get();
        const applicationsSnapshot = await db.collection('applications').get();

        const reports = {
            totalUsers: usersSnapshot.size,
            totalInstitutions: institutionsSnapshot.size,
            totalCompanies: companiesSnapshot.size,
            totalApplications: applicationsSnapshot.size,
            usersByRole: {},
            applicationsByStatus: {}
        };

        res.status(200).json({
            success: true,
            reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate reports",
            error: error.message
        });
    }
};

// Export all functions - UPDATED TO INCLUDE NEW METHODS
module.exports = { 
    getAdminDashboard, 
    manageInstitution,
    manageCompanies,
    approveCompany, 
    suspendCompany,
    getReports
};

