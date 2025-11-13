const { db } = require('../config/firebase');
const { hashPassword, comparePassword, generateToken, validateEmail } = require('../utils/helpers');

// In-memory storage for development
const memoryDB = {
    users: new Map(),
    verificationCodes: new Map() // Store verification codes temporarily
};

class User {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.isVerified = data.isVerified || false; // Require email verification
        this.verificationCode = data.verificationCode || null;
        this.verificationCodeExpiry = data.verificationCodeExpiry || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    async save() {
        try {
            // Hash password
            const hashedPassword = await hashPassword(this.password);

            const userData = {
                email: this.email,
                password: hashedPassword,
                role: this.role,
                firstName: this.firstName,
                lastName: this.lastName,
                isVerified: this.isVerified || false, // Require verification
                verificationCode: this.verificationCode || null,
                verificationCodeExpiry: this.verificationCodeExpiry || null,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            };

            // Save to memoryDB
            memoryDB.users.set(this.email, userData);
            
            // Store verification code separately for quick lookup
            if (this.verificationCode) {
                memoryDB.verificationCodes.set(this.email, {
                    code: this.verificationCode,
                    expiry: this.verificationCodeExpiry
                });
            }

            // Save to Firebase
            try {
                const userRef = db.collection('users').doc(this.email);
                await userRef.set(userData);
                console.log(`✅ User saved to Firebase: ${this.email}`);
            } catch (firebaseError) {
                console.log('Development mode: Using memory storage');
            }

            return {
                success: true,
                user: {
                    email: this.email,
                    role: this.role,
                    isVerified: this.isVerified || false
                },
                verificationCode: this.verificationCode // Return code for email sending
            };
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    static async findByEmail(email) {
        try {
            // Check memoryDB first
            if (memoryDB.users.has(email)) {
                return memoryDB.users.get(email);
            }

            // Fallback to Firebase
            const userRef = db.collection('users').doc(email);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            return memoryDB.users.get(email) || null;
        }
    }

    static async verifyCredentials(email, password) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            // CHECK EMAIL VERIFICATION - REQUIRED
            if (!user.isVerified) {
                return { 
                    success: false, 
                    message: 'Please verify your email before logging in. Check your inbox for the verification code.',
                    requiresVerification: true
                };
            }

            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Invalid password' };
            }

            // Generate token
            const token = generateToken({
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName
            });

            return {
                success: true,
                user: {
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.isVerified
                },
                token
            };
        } catch (error) {
            throw new Error('Error verifying credentials: ' + error.message);
        }
    }

    // Verify email with code
    static async verifyEmail(email, code) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (user.isVerified) {
                return { success: false, message: 'Email already verified' };
            }

            // Check verification code from memory or Firebase
            const storedCode = memoryDB.verificationCodes.get(email);
            const verificationCode = storedCode?.code || user.verificationCode;
            const expiry = storedCode?.expiry || user.verificationCodeExpiry;

            if (!verificationCode) {
                return { success: false, message: 'No verification code found. Please register again.' };
            }

            if (code !== verificationCode) {
                return { success: false, message: 'Invalid verification code' };
            }

            // Check if code expired (10 minutes)
            if (expiry && new Date() > new Date(expiry)) {
                return { success: false, message: 'Verification code has expired. Please request a new one.' };
            }

            // Update user as verified
            user.isVerified = true;
            user.verificationCode = null;
            user.verificationCodeExpiry = null;
            user.updatedAt = new Date().toISOString();

            // Update in memory
            memoryDB.users.set(email, user);
            memoryDB.verificationCodes.delete(email);

            // Update in Firebase
            try {
                const userRef = db.collection('users').doc(email);
                await userRef.update({
                    isVerified: true,
                    verificationCode: null,
                    verificationCodeExpiry: null,
                    updatedAt: new Date().toISOString()
                });
            } catch (firebaseError) {
                console.log('Development mode: Using memory storage');
            }

            return {
                success: true,
                message: 'Email verified successfully'
            };
        } catch (error) {
            throw new Error('Error verifying email: ' + error.message);
        }
    }

    // Resend verification code
    static async resendVerificationCode(email, newCode, expiry) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                return { success: false, message: 'User not found' };
            }

            if (user.isVerified) {
                return { success: false, message: 'Email already verified' };
            }

            // Update verification code
            user.verificationCode = newCode;
            user.verificationCodeExpiry = expiry;
            user.updatedAt = new Date().toISOString();

            // Update in memory
            memoryDB.users.set(email, user);
            memoryDB.verificationCodes.set(email, {
                code: newCode,
                expiry: expiry
            });

            // Update in Firebase
            try {
                const userRef = db.collection('users').doc(email);
                await userRef.update({
                    verificationCode: newCode,
                    verificationCodeExpiry: expiry,
                    updatedAt: new Date().toISOString()
                });
            } catch (firebaseError) {
                console.log('Development mode: Using memory storage');
            }

            return {
                success: true,
                message: 'Verification code resent',
                verificationCode: newCode
            };
        } catch (error) {
            throw new Error('Error resending verification code: ' + error.message);
        }
    }
}

module.exports = User;