/**
 * Script to check SendGrid configuration
 * Usage: node check-sendgrid-config.js
 */

require('dotenv').config();

console.log('\n===== SENDGRID CONFIGURATION CHECK =====\n');

// Check API Key
const apiKey = process.env.SENDGRID_API_KEY;
if (apiKey) {
    if (apiKey.startsWith('SG.')) {
        console.log('SENDGRID_API_KEY: SET');
        console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
        console.log(`   Length: ${apiKey.length} characters (should be ~70)`);
    } else {
        console.log('SENDGRID_API_KEY: INVALID FORMAT');
        console.log('   API key should start with "SG."');
    }
} else {
    console.log('SENDGRID_API_KEY: NOT SET');
    console.log('   Add to .env: SENDGRID_API_KEY=SG.your-key-here');
}

console.log('');

// Check From Email
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
if (fromEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(fromEmail)) {
        console.log('SENDGRID_FROM_EMAIL: SET');
        console.log(`   Email: ${fromEmail}`);
        console.log('   Make sure this email is verified in SendGrid');
    } else {
        console.log('SENDGRID_FROM_EMAIL: INVALID FORMAT');
        console.log(`   Current value: ${fromEmail}`);
    }
} else {
    console.log('SENDGRID_FROM_EMAIL: NOT SET');
    console.log('   Add to .env: SENDGRID_FROM_EMAIL=your-verified-email@domain.com');
    console.log('   Will use default: noreply@careerguidance.ls');
}

console.log('');

// Check Environment
const nodeEnv = process.env.NODE_ENV;
console.log(`NODE_ENV: ${nodeEnv || 'not set (defaults to development)'}`);

console.log('');

// Summary
if (apiKey && fromEmail && apiKey.startsWith('SG.')) {
    console.log('Configuration looks good');
    console.log('   Next steps:');
    console.log('   1. Make sure sender email is verified in SendGrid');
    console.log('   2. Restart your server: npm start');
    console.log('   3. Test registration to verify emails are sent\n');
} else {
    console.log('Configuration incomplete');
    console.log('   Follow the setup guide: SENDGRID_SETUP_GUIDE.md\n');
}

