/**
 * Interactive SendGrid Setup Helper
 * This script helps you configure SendGrid step by step
 */

require('dotenv').config();
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function setupSendGrid() {
    console.log('\n📧 ===== SENDGRID SETUP HELPER =====\n');
    
    // Check current configuration
    const currentApiKey = process.env.SENDGRID_API_KEY;
    const currentFromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    console.log('Current Configuration:');
    if (currentApiKey) {
        console.log(`✅ API Key: ${currentApiKey.substring(0, 10)}... (${currentApiKey.length} chars)`);
    } else {
        console.log('❌ API Key: NOT SET');
    }
    
    if (currentFromEmail) {
        console.log(`✅ From Email: ${currentFromEmail}`);
    } else {
        console.log('❌ From Email: NOT SET');
    }
    
    console.log('\n');
    
    // Step 1: API Key
    if (!currentApiKey) {
        console.log('📝 Step 1: API Key Setup');
        console.log('   1. Go to: https://app.sendgrid.com/settings/api_keys');
        console.log('   2. Click "Create API Key"');
        console.log('   3. Name it: "Career Guidance Platform"');
        console.log('   4. Choose "Full Access" or "Restricted Access" (with Mail Send)');
        console.log('   5. Copy the API key (starts with SG.)\n');
        
        const apiKey = await question('Enter your SendGrid API Key: ');
        if (apiKey && apiKey.startsWith('SG.')) {
            console.log('✅ API Key format looks good!');
            console.log(`   Add this to your .env file:\n   SENDGRID_API_KEY=${apiKey}\n`);
        } else {
            console.log('⚠️  API Key should start with "SG."');
        }
    }
    
    // Step 2: Verify Sender Email
    console.log('\n📝 Step 2: Verify Sender Email');
    console.log('   1. Go to: https://app.sendgrid.com/settings/sender_auth');
    console.log('   2. Click "Verify a Single Sender"');
    console.log('   3. Fill in the form with your email');
    console.log('   4. Check your email and click verification link\n');
    
    const fromEmail = await question('Enter the email you verified in SendGrid: ');
    
    if (fromEmail && fromEmail.includes('@') && fromEmail.includes('.')) {
        console.log(`\n✅ Email format looks good: ${fromEmail}`);
        console.log('\n📝 Add these lines to your backend/.env file:\n');
        console.log('```env');
        if (!currentApiKey) {
            console.log(`SENDGRID_API_KEY=${currentApiKey || 'SG.your-api-key-here'}`);
        }
        console.log(`SENDGRID_FROM_EMAIL=${fromEmail}`);
        console.log('```\n');
        
        console.log('After adding to .env:');
        console.log('1. Save the .env file');
        console.log('2. Restart your server: npm start');
        console.log('3. Test registration to verify emails work\n');
    } else {
        console.log('⚠️  Invalid email format');
    }
    
    rl.close();
}

setupSendGrid().catch(console.error);

