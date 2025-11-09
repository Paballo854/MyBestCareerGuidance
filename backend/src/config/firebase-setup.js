const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const initializeFirebase = () => {
    try {
        // Use absolute path to the service account file
        const serviceAccountPath = path.join(__dirname, '..', '..', 'firebase-service-account.json');
        
        console.log("🔍 Looking for Firebase file at:", serviceAccountPath);
        
        // Check if file exists
        if (!fs.existsSync(serviceAccountPath)) {
            throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
        }

        const serviceAccount = require(serviceAccountPath);
        
        console.log("✅ Firebase file found! Project:", serviceAccount.project_id);
        
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        });

        const db = admin.firestore();
        console.log("🔥 Firebase Firestore connected successfully!");
        return { admin, db, initialized: true };
        
    } catch (error) {
        console.log("⚠️  Firebase initialization failed:", error.message);
        console.log("🔧 Continuing with development mode (memory storage)");
        
        // Mock db for development
        const mockDB = {
            collection: (name) => ({
                doc: (id) => ({
                    set: async (data) => console.log(`[MOCK DB] Setting ${name}/${id}`),
                    get: async () => ({ exists: false, data: () => null }),
                    update: async (data) => console.log(`[MOCK DB] Updating ${name}/${id}`),
                    delete: async () => console.log(`[MOCK DB] Deleting ${name}/${id}`),
                    collection: (subName) => mockDB.collection(`${name}/${id}/${subName}`)
                }),
                where: (field, operator, value) => ({
                    get: async () => ({ empty: true, size: 0, docs: [] })
                })
            })
        };
        
        return { admin: null, db: mockDB, initialized: false };
    }
};

module.exports = { initializeFirebase };
