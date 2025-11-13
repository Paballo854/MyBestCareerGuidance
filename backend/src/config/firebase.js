const { initializeFirebase } = require("./firebase-setup");

const { admin, db, initialized } = initializeFirebase();

const initializeCollections = async () => {
    if (initialized) {
        try {
            // Create main collections if they don't exist
            const collections = [
                "users", "institutions", "courses", "applications", 
                "jobPostings", "companies", "faculties", "admissions", "transcripts",
                "tempEmailVerifications", // For pre-registration email verification
                "emailQueue" // For failed email retry queue (production)
            ];
            
            console.log("📁 Firestore collections ready:", collections.join(", "));
            
            // Create a test document to verify write permissions
            const testRef = db.collection("system").doc("connection-test");
            await testRef.set({
                test: true,
                message: "Firebase connection successful",
                timestamp: new Date().toISOString(),
                system: "My Best Career Guidance",
                status: "ACTIVE"
            });
            
            console.log("✅ Firebase read/write permissions verified!");
            
        } catch (error) {
            console.log("❌ Firebase permissions error:", error.message);
        }
    } else {
        console.log("🔧 Development mode: Using memory storage");
    }
};

module.exports = { admin, db, initializeCollections, firebaseInitialized: initialized };
