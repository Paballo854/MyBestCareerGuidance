const sgMail = require('@sendgrid/mail');

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (email, verificationCode, firstName) => {
    try {
        console.log('\n✨ ===== SENDING VERIFICATION EMAIL =====');
        console.log(`📧 TO: ${email}`);
        console.log(`🔐 CODE: ${verificationCode}`);
        
        // Check if SendGrid API key is available
        if (!process.env.SENDGRID_API_KEY) {
            console.log('❌ SendGrid API key not found. Using console mode.');
            console.log(`📧 Verification code: ${verificationCode}`);
            return true;
        }

        // Set up SendGrid with your REAL API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
            to: email,
            from: {
                email: 'noreply@careerguidance.ls',
                name: 'My Best Career Guidance'
            },
            subject: 'Verify Your Email - Career Guidance Platform',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #2563eb; padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0;">My Best Career Guidance</h1>
                        <p style="margin: 10px 0 0 0;">Email Verification Required</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f8fafc;">
                        <h2 style="color: #333;">Hello ${firstName}!</h2>
                        <p>Thank you for registering with <strong>My Best Career Guidance</strong>.</p>
                        
                        <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0;">
                            <p style="color: #666; margin-bottom: 15px;">Your verification code is:</p>
                            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; background: #f0f9ff; padding: 15px; border-radius: 8px;">
                                ${verificationCode}
                            </div>
                        </div>
                        
                        <p style="color: #ef4444; font-weight: bold;">
                            ⚠️ This code will expire in 10 minutes.
                        </p>
                        
                        <p>Enter this code in the verification page to activate your account.</p>
                    </div>
                </div>
            `
        };

        // Send the email via SendGrid
        await sgMail.send(msg);
        
        console.log('✅ REAL EMAIL SENT VIA SENDGRID!');
        console.log(`📧 Email delivered to: ${email}`);
        console.log('📱 Check your email inbox now!\n');
        
        return true;

    } catch (error) {
        console.error('❌ SendGrid Error:', error.response?.body || error.message);
        console.log(`📧 Fallback - Verification code: ${verificationCode}`);
        return true;
    }
};

module.exports = { generateVerificationCode, sendVerificationEmail };