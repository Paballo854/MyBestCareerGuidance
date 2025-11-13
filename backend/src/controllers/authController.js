const User = require('../models/User');
const { validateEmail } = require('../utils/helpers');
const { generateVerificationCode, sendVerificationEmail } = require('../utils/emailService');

const register = async (req, res) => {
    try {
        const { email, password, role, firstName, lastName } = req.body;

        // Validation
        if (!email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        if (/\d/.test(firstName)) {
            return res.status(400).json({
                success: false,
                message: 'First name cannot contain numbers'
            });
        }

        if (/\d/.test(lastName)) {
            return res.status(400).json({
                success: false,
                message: 'Last name cannot contain numbers'
            });
        }

        // Allow admin role for development
        const validRoles = ['student', 'institute', 'company', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be: student, institute, company, or admin'
            });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const { db } = require('../config/firebase');
        const tempVerificationRef = db.collection('tempEmailVerifications').doc(email);
        const tempVerificationDoc = await tempVerificationRef.get();
        if (!tempVerificationDoc.exists || !tempVerificationDoc.data().verified) {
            return res.status(400).json({
                success: false,
                message: 'Email not verified. Please verify your email before registering.'
            });
        }

        const user = new User({
            email,
            password,
            role,
            firstName,
            lastName,
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiry: null
        });

        const result = await user.save();

        // Generate token for immediate login
        const { generateToken } = require('../utils/helpers');
        const token = generateToken({
            id: result.user.email, // Use email as ID since that's the document ID in Firestore
            email: result.user.email,
            role: result.user.role,
            firstName: firstName,
            lastName: lastName
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful! You are now logged in.',
            user: {
                email: result.user.email,
                role: result.user.role,
                firstName: firstName,
                lastName: lastName,
                isVerified: true
            },
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        console.log('[DEBUG] Login request received at:', new Date().toISOString());
        console.log('[DEBUG] Request body:', JSON.stringify(req.body, null, 2));
        
        const { email, password } = req.body;

        console.log('[DEBUG] Checking if email and password exist...');
        if (!email || !password) {
            console.log('[DEBUG] Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        console.log('[DEBUG] Calling User.verifyCredentials...');
        const result = await User.verifyCredentials(email, password);
        console.log('[DEBUG] User.verifyCredentials completed:', JSON.stringify(result, null, 2));

        if (!result.success) {
            console.log('[DEBUG] Credential verification failed:', result.message);
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        console.log('[DEBUG] Login successful, sending response...');
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: result.user,
            token: result.token
        });

    } catch (error) {
        console.log('[DEBUG] Login error:', error.message);
        console.log('[DEBUG] Full error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findByEmail(req.user.email);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove password from response
        const { password, ...userData } = user;

        res.status(200).json({
            success: true,
            user: userData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

// Verify email with code
const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
        }

        const result = await User.verifyEmail(email, code);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email verification failed',
            error: error.message
        });
    }
};

// Check email and send pre-registration verification code
const checkEmailAndSendCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Check if email already exists (is already registered)
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered. Please use a different email or try logging in.',
                emailExists: true
            });
        }

        // Generate verification code for pre-registration
        const verificationCode = generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store verification code temporarily (we'll use a temporary storage)
        // In production, you might want to use Redis or a separate collection
        const { db } = require('../config/firebase');
        const tempVerificationRef = db.collection('tempEmailVerifications').doc(email);
        await tempVerificationRef.set({
            email,
            code: verificationCode,
            expiry: verificationCodeExpiry.toISOString(),
            createdAt: new Date().toISOString(),
            purpose: 'pre-registration'
        });

        // Send verification email directly to the registering email
        // In production, email sending is critical - handle accordingly
        const emailResult = await sendVerificationEmail(email, verificationCode, 'User', true);
        
        // Handle email result based on environment
        // Check if running on localhost (development)
        const isLocalhost = process.env.PORT === '5000' || 
                           process.env.HOST === 'localhost' || 
                           process.env.HOST === '0.0.0.0' ||
                           !process.env.NODE_ENV ||
                           process.env.NODE_ENV === 'development';
        
        if (process.env.NODE_ENV === 'production' && !isLocalhost) {
            // Real production environment
            if (!emailResult.success) {
                console.error(`Email sending failed in production for ${email}`);
                console.error('   Code is stored in database. User may need manual assistance.');
            }
        } else {
            // Development/localhost mode - provide helpful feedback
            if (emailResult.method === 'sendgrid') {
                console.log(`Verification code sent successfully to ${email} via SendGrid`);
            } else if (emailResult.method === 'console') {
                console.log(`Development/localhost mode: Verification code shown in console`);
            } else if (emailResult.method === 'fallback') {
                console.log(`Email sending failed. Code available in console: ${emailResult.code}`);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Verification code sent to your email. Please check your inbox.',
            email: email
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send verification code',
            error: error.message
        });
    }
};

// Verify pre-registration email code
const verifyPreRegistrationEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
        }

        // Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered'
            });
        }

        // Get stored verification code
        const { db } = require('../config/firebase');
        const tempVerificationRef = db.collection('tempEmailVerifications').doc(email);
        const tempVerificationDoc = await tempVerificationRef.get();

        if (!tempVerificationDoc.exists) {
            return res.status(400).json({
                success: false,
                message: 'No verification code found. Please request a new code.'
            });
        }

        const tempData = tempVerificationDoc.data();

        // Check if code matches
        if (code !== tempData.code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Check if code expired
        if (new Date() > new Date(tempData.expiry)) {
            await tempVerificationRef.delete();
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new one.'
            });
        }

        // Mark email as verified for registration
        await tempVerificationRef.update({
            verified: true,
            verifiedAt: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now proceed with registration.',
            email: email,
            verified: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email verification failed',
            error: error.message
        });
    }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const result = await User.resendVerificationCode(email, verificationCode, verificationCodeExpiry);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        // Get user to send email
        const user = await User.findByEmail(email);
        if (user) {
            try {
                await sendVerificationEmail(email, verificationCode, user.firstName);
                console.log(`Verification email resent to ${email}`);
            } catch (emailError) {
                console.error('Failed to send verification email:', emailError);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Verification code resent. Please check your email.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to resend verification code',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    verifyEmail,
    resendVerificationCode,
    checkEmailAndSendCode,
    verifyPreRegistrationEmail
};
