/**
 * Interactive SendGrid Configuration Helper
 * This will help you set up SendGrid step by step
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function configureSendGrid() {
    console.log('\n📧 ===== SENDGRID CONFIGURATION WIZARD =====\n');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    console.log('Current Configuration:');
    const currentApiKey = process.env.SENDGRID_API_KEY;
    const currentFromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    if (currentApiKey) {
        console.log(`✅ API Key: ${currentApiKey.substring(0, 15)}... (${currentApiKey.length} chars)`);
    } else {
        console.log('❌ API Key: NOT SET');
    }
    
    if (currentFromEmail) {
        console.log(`✅ From Email: ${currentFromEmail}`);
    } else {
        console.log('❌ From Email: NOT SET');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('STEP 1: Verify Your Email in SendGrid');
    console.log('='.repeat(50));
    console.log('\n1. Open this link in your browser:');
    console.log('   https://app.sendgrid.com/settings/sender_auth\n');
    console.log('2. Click "Verify a Single Sender" button');
    console.log('3. Fill in the form:');
    console.log('   - From Email: Your email (e.g., yourname@gmail.com)');
    console.log('   - From Name: My Best Career Guidance');
    console.log('   - Reply To: Same as From Email');
    console.log('   - Complete address, city, state, zip, country');
    console.log('4. Click "Create"');
    console.log('5. Check your email and click the verification link');
    console.log('6. Wait for "Verified" status in SendGrid\n');
    
    const continueStep1 = await question('Have you verified your email in SendGrid? (yes/no): ');
    
    if (continueStep1.toLowerCase() !== 'yes' && continueStep1.toLowerCase() !== 'y') {
        console.log('\n⚠️  Please verify your email first, then run this script again.');
        console.log('   Link: https://app.sendgrid.com/settings/sender_auth\n');
        rl.close();
        return;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('STEP 2: Enter Your Verified Email');
    console.log('='.repeat(50));
    console.log('\nEnter the email address you just verified in SendGrid:');
    
    const verifiedEmail = await question('Email: ');
    
    if (!verifiedEmail || !verifiedEmail.includes('@') || !verifiedEmail.includes('.')) {
        console.log('\n❌ Invalid email format. Please run the script again.');
        rl.close();
        return;
    }
    
    console.log(`\n✅ Email format looks good: ${verifiedEmail}`);
    
    // Update .env file
    console.log('\n' + '='.repeat(50));
    console.log('STEP 3: Updating .env File');
    console.log('='.repeat(50));
    
    // Check if SENDGRID_FROM_EMAIL already exists
    if (envContent.includes('SENDGRID_FROM_EMAIL=')) {
        // Update existing line
        envContent = envContent.replace(
            /SENDGRID_FROM_EMAIL=.*/g,
            `SENDGRID_FROM_EMAIL=${verifiedEmail}`
        );
        console.log('✅ Updated SENDGRID_FROM_EMAIL in .env');
    } else {
        // Add new line
        if (envContent && !envContent.endsWith('\n')) {
            envContent += '\n';
        }
        envContent += `\n# SendGrid Email Configuration\nSENDGRID_FROM_EMAIL=${verifiedEmail}\n`;
        console.log('✅ Added SENDGRID_FROM_EMAIL to .env');
    }
    
    // Write to file
    try {
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log(`\n✅ .env file updated successfully!`);
        console.log(`   Location: ${envPath}`);
    } catch (error) {
        console.error('\n❌ Error writing to .env file:', error.message);
        console.log('\nPlease manually add this line to backend/.env:');
        console.log(`SENDGRID_FROM_EMAIL=${verifiedEmail}`);
        rl.close();
        return;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('STEP 4: Verify Configuration');
    console.log('='.repeat(50));
    
    // Reload .env to verify
    require('dotenv').config({ override: true });
    
    if (process.env.SENDGRID_FROM_EMAIL === verifiedEmail) {
        console.log('\n✅ Configuration verified!');
        console.log(`   From Email: ${process.env.SENDGRID_FROM_EMAIL}`);
        if (process.env.SENDGRID_API_KEY) {
            console.log(`   API Key: ${process.env.SENDGRID_API_KEY.substring(0, 15)}... (SET)`);
        }
    } else {
        console.log('\n⚠️  Configuration might need a server restart to take effect');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log('\nNext steps:');
    console.log('1. Restart your server: npm start');
    console.log('2. Test registration with a real email');
    console.log('3. Check backend console for success message');
    console.log('4. Check your email inbox for verification code\n');
    
    rl.close();
}

// Run the configuration
configureSendGrid().catch(error => {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
});

