/**
 * Script to find a user by email or partial email
 * Usage: node find-user.js <email>
 */

require('dotenv').config();
const { initializeFirebase } = require('./src/config/firebase-setup');

const findUser = async (searchTerm) => {
    try {
        console.log('\n🔍 ===== SEARCHING FOR USER =====');
        console.log(`📧 Search term: ${searchTerm}`);
        console.log('');

        const { db } = initializeFirebase();

        if (!db) {
            console.error('❌ Firebase not initialized.');
            process.exit(1);
        }

        // Search in users collection
        console.log('🔍 Searching in users collection...');
        const usersSnapshot = await db.collection('users').get();
        
        const matches = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            const email = doc.id;
            
            // Check if search term matches email or user data
            if (email.includes(searchTerm) || 
                userData.email?.includes(searchTerm) ||
                userData.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userData.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) {
                matches.push({
                    email: email,
                    ...userData
                });
            }
        });

        if (matches.length > 0) {
            console.log(`\n✅ Found ${matches.length} matching user(s):\n`);
            matches.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Name: ${user.firstName || 'N/A'} ${user.lastName || 'N/A'}`);
                console.log(`   Role: ${user.role || 'N/A'}`);
                console.log(`   Verified: ${user.isVerified ? 'Yes' : 'No'}`);
                console.log('');
            });
        } else {
            console.log('❌ No users found matching the search term.');
        }

        // Also check tempEmailVerifications
        console.log('\n🔍 Checking temporary email verifications...');
        const tempSnapshot = await db.collection('tempEmailVerifications').get();
        const tempMatches = [];
        tempSnapshot.forEach(doc => {
            if (doc.id.includes(searchTerm)) {
                tempMatches.push({
                    email: doc.id,
                    ...doc.data()
                });
            }
        });

        if (tempMatches.length > 0) {
            console.log(`\n✅ Found ${tempMatches.length} temporary verification(s):\n`);
            tempMatches.forEach((temp, index) => {
                console.log(`${index + 1}. Email: ${temp.email}`);
                console.log(`   Verified: ${temp.verified ? 'Yes' : 'No'}`);
                console.log(`   Created: ${temp.createdAt || 'N/A'}`);
                console.log('');
            });
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    }
};

const searchTerm = process.argv[2];

if (!searchTerm) {
    console.error('❌ Error: Search term is required');
    console.log('\nUsage: node find-user.js <search-term>');
    console.log('Example: node find-user.js toka70518');
    process.exit(1);
}

findUser(searchTerm)
    .then(() => {
        console.log('\n✅ Search completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Search failed:', error);
        process.exit(1);
    });

