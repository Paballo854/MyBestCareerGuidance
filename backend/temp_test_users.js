// Add this temporary route to your authRoutes.js to test user existence
router.get('/test-users', async (req, res) => {
    try {
        const User = require('../models/User');
        
        // Test with a specific email
        const testEmail = 'test@example.com';
        const user = await User.findByEmail(testEmail);
        
        res.status(200).json({
            success: true,
            message: 'User check completed',
            testEmail: testEmail,
            userExists: !!user,
            user: user ? { email: user.email, role: user.role } : null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking users',
            error: error.message
        });
    }
});
