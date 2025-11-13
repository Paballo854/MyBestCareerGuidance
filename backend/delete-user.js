/**
 * Script to permanently delete a user from the system
 * Usage: node delete-user.js <email>
 * Example: node delete-user.js toka70518
 */

require('dotenv').config();
const { initializeFirebase } = require('./src/config/firebase-setup');

const deleteUserPermanently = async (email) => {
    try {
        console.log('\n🗑️  ===== PERMANENT USER DELETION =====');
        console.log(`📧 Deleting user: ${email}`);
        console.log('');

        // Initialize Firebase
        const { db } = initializeFirebase();

        if (!db) {
            console.error('❌ Firebase not initialized. Please check your configuration.');
            process.exit(1);
        }

        // Step 1: Check if user exists
        console.log('🔍 Step 1: Checking if user exists...');
        const userRef = db.collection('users').doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            console.log(`⚠️  User with email "${email}" not found in users collection.`);
            console.log('   Checking other collections...\n');
        } else {
            const userData = userDoc.data();
            console.log(`✅ User found: ${userData.firstName || ''} ${userData.lastName || ''} (${userData.role || 'unknown role'})`);
        }

        // Step 2: Delete from users collection
        console.log('\n🗑️  Step 2: Deleting from users collection...');
        try {
            await userRef.delete();
            console.log('✅ Deleted from users collection');
        } catch (error) {
            console.log(`⚠️  Could not delete from users: ${error.message}`);
        }

        // Step 3: Delete from tempEmailVerifications
        console.log('\n🗑️  Step 3: Deleting temporary email verifications...');
        try {
            const tempVerificationRef = db.collection('tempEmailVerifications').doc(email);
            const tempDoc = await tempVerificationRef.get();
            if (tempDoc.exists) {
                await tempVerificationRef.delete();
                console.log('✅ Deleted temporary email verification records');
            } else {
                console.log('ℹ️  No temporary verification records found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete temp verifications: ${error.message}`);
        }

        // Step 4: Delete user's applications
        console.log('\n🗑️  Step 4: Deleting user applications...');
        try {
            // Find applications by studentEmail
            const applicationsByEmail = await db.collection('applications')
                .where('studentEmail', '==', email)
                .get();
            
            // Find applications by studentId (if email was used as ID)
            const applicationsByStudentId = await db.collection('applications')
                .where('studentId', '==', email)
                .get();

            let deletedApps = 0;
            
            // Delete applications found by email
            for (const doc of applicationsByEmail.docs) {
                await doc.ref.delete();
                deletedApps++;
            }

            // Delete applications found by studentId
            for (const doc of applicationsByStudentId.docs) {
                await doc.ref.delete();
                deletedApps++;
            }

            if (deletedApps > 0) {
                console.log(`✅ Deleted ${deletedApps} application(s)`);
            } else {
                console.log('ℹ️  No applications found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete applications: ${error.message}`);
        }

        // Step 5: Delete job applications
        console.log('\n🗑️  Step 5: Deleting job applications...');
        try {
            const jobApplications = await db.collection('jobApplications')
                .where('studentEmail', '==', email)
                .get();

            let deletedJobApps = 0;
            for (const doc of jobApplications.docs) {
                await doc.ref.delete();
                deletedJobApps++;
            }

            if (deletedJobApps > 0) {
                console.log(`✅ Deleted ${deletedJobApps} job application(s)`);
            } else {
                console.log('ℹ️  No job applications found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete job applications: ${error.message}`);
        }

        // Step 6: Delete documents/transcripts
        console.log('\n🗑️  Step 6: Deleting documents and transcripts...');
        try {
            const documents = await db.collection('documents')
                .where('studentId', '==', email)
                .get();

            let deletedDocs = 0;
            for (const doc of documents.docs) {
                await doc.ref.delete();
                deletedDocs++;
            }

            if (deletedDocs > 0) {
                console.log(`✅ Deleted ${deletedDocs} document(s)`);
            } else {
                console.log('ℹ️  No documents found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete documents: ${error.message}`);
        }

        // Step 7: Delete job notifications
        console.log('\n🗑️  Step 7: Deleting job notifications...');
        try {
            const notifications = await db.collection('jobNotifications')
                .where('studentId', '==', email)
                .get();

            let deletedNotifs = 0;
            for (const doc of notifications.docs) {
                await doc.ref.delete();
                deletedNotifs++;
            }

            if (deletedNotifs > 0) {
                console.log(`✅ Deleted ${deletedNotifs} notification(s)`);
            } else {
                console.log('ℹ️  No notifications found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete notifications: ${error.message}`);
        }

        // Step 8: Check if user is an institution or company
        console.log('\n🗑️  Step 8: Checking institution/company records...');
        try {
            // Check institutions collection
            const institutionRef = db.collection('institutions').doc(email);
            const instDoc = await institutionRef.get();
            if (instDoc.exists) {
                await institutionRef.delete();
                console.log('✅ Deleted institution record');
            }

            // Check companies collection
            const companyRef = db.collection('companies').doc(email);
            const companyDoc = await companyRef.get();
            if (companyDoc.exists) {
                await companyRef.delete();
                console.log('✅ Deleted company record');
            }

            if (!instDoc.exists && !companyDoc.exists) {
                console.log('ℹ️  No institution or company records found');
            }
        } catch (error) {
            console.log(`⚠️  Could not delete institution/company records: ${error.message}`);
        }

        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ USER DELETION COMPLETE!');
        console.log('='.repeat(50));
        console.log(`📧 Email: ${email}`);
        console.log('✅ User can now re-register from scratch');
        console.log('✅ All related data has been removed');
        console.log('');

    } catch (error) {
        console.error('\n❌ ERROR during deletion:');
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
    console.error('❌ Error: Email address is required');
    console.log('\nUsage: node delete-user.js <email>');
    console.log('Example: node delete-user.js toka70518');
    process.exit(1);
}

// Validate email format (basic check)
if (!email.includes('@') && !email.includes('.')) {
    console.log(`⚠️  Warning: "${email}" doesn't look like a standard email format.`);
    console.log('   Proceeding anyway (might be a username or partial email)...\n');
}

// Run deletion
deleteUserPermanently(email)
    .then(() => {
        console.log('✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error);
        process.exit(1);
    });

