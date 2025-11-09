const { db } = require('../config/firebase');
const { hashPassword, comparePassword, generateToken, validateEmail } = require('../utils/helpers');

// In-memory storage for development
const memoryDB = {
    users: new Map()
};

class User {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.role = data.role;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.isVerified = true; // Always verified
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
                isVerified: true, // Always verified
                createdAt: this.createdAt,
                updatedAt: this.updatedAt
            };

            // Save to memoryDB
            memoryDB.users.set(this.email, userData);

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
                    isVerified: true
                }
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

            // NO EMAIL VERIFICATION CHECK - REMOVED

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
                    isVerified: true
                },
                token
            };
        } catch (error) {
            throw new Error('Error verifying credentials: ' + error.message);
        }
    }
}

module.exports = User;