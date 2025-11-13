const sgMail = require('@sendgrid/mail');

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

// Smart environment detection
// If running on localhost (default port 5000) or NODE_ENV is development, treat as development
const isLocalhost = process.env.PORT === '5000' || 
                    process.env.HOST === 'localhost' || 
                    process.env.HOST === '0.0.0.0' ||
                    !process.env.NODE_ENV ||
                    process.env.NODE_ENV === 'development';

const IS_PRODUCTION = process.env.NODE_ENV === 'production' && !isLocalhost;
const IS_DEVELOPMENT = !IS_PRODUCTION; // If not production, it's development

/**
 * Generate a 6-digit verification code
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sleep/delay function for retries
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff
 */
const retryWithBackoff = async (fn, maxRetries = MAX_RETRIES, delay = RETRY_DELAY) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            
            // Don't retry on certain errors (authentication, invalid email format)
            if (error.code === 401 || error.code === 403 || error.code === 400) {
                throw error;
            }
            
            if (attempt < maxRetries) {
                const backoffDelay = delay * Math.pow(2, attempt - 1);
                console.log(`Email send attempt ${attempt} failed. Retrying in ${backoffDelay}ms...`);
                await sleep(backoffDelay);
            }
        }
    }
    
    throw lastError;
};

/**
 * Validate email configuration
 */
const validateEmailConfig = () => {
    const config = {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        hasFromEmail: !!process.env.SENDGRID_FROM_EMAIL,
        fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@careerguidance.ls',
        isValid: false
    };

    if (config.hasApiKey && config.hasFromEmail) {
        config.isValid = true;
    }

    return config;
};

/**
 * Log email attempt (for monitoring/auditing)
 */
const logEmailAttempt = (email, code, method, success, error = null) => {
        const logEntry = {
        timestamp: new Date().toISOString(),
        email: email,
        code: code,
        method: method,
        success: success,
        environment: IS_DEVELOPMENT || isLocalhost ? 'development' : 'production',
        error: error ? error.message : null
    };

    // Log based on actual environment
    if (IS_PRODUCTION && !isLocalhost) {
        // Real production - structured logging
        console.log('[EMAIL_LOG]', JSON.stringify(logEntry));
    } else {
        // Development - more detailed logging
        console.log('[EMAIL_LOG]', JSON.stringify(logEntry, null, 2));
    }
};

/**
 * Send verification email with retry logic and proper error handling
 */
const sendVerificationEmail = async (email, verificationCode, firstName = 'User', isPreRegistration = false) => {
    const startTime = Date.now();
    
    try {
        // Validate email format
        if (!email || !email.includes('@') || !email.includes('.')) {
            throw new Error('Invalid email address format');
        }

        // Validate email configuration
        const config = validateEmailConfig();

        // In development/localhost without SendGrid, use console mode
        if (!config.hasApiKey) {
            if (IS_DEVELOPMENT || isLocalhost) {
                console.log('\n===== VERIFICATION EMAIL (CONSOLE MODE) =====');
                console.log(`TO: ${email}`);
                console.log(`CODE: ${verificationCode}`);
                console.log(`Purpose: ${isPreRegistration ? 'Pre-Registration' : 'Account Verification'}`);
                console.log('To enable email sending, configure SendGrid in .env');
                console.log('Running in development/localhost mode - code shown in console\n');
                
                logEmailAttempt(email, verificationCode, 'console', true);
                return { 
                    success: true, 
                    method: 'console', 
                    email: email, 
                    code: verificationCode 
                };
            } else {
                // In real production (not localhost), we should fail if email service is not configured
                throw new Error('Email service not configured. SENDGRID_API_KEY is required in production.');
            }
        }

        // Configure SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Determine email content
        const emailSubject = isPreRegistration 
            ? 'Verify Your Email - Complete Registration' 
            : 'Verify Your Email - Career Guidance Platform';
        
        const emailGreeting = isPreRegistration
            ? `Hello!`
            : `Hello ${firstName}!`;
        
        const emailMessage = isPreRegistration
            ? `You're one step away from creating your account on <strong>My Best Career Guidance</strong>. Please verify your email address to continue.`
            : `Thank you for registering with <strong>My Best Career Guidance</strong>. Please verify your email address to activate your account.`;
        
        const emailAction = isPreRegistration
            ? `Enter this code in the registration page to complete your account setup.`
            : `Enter this code in the verification page to activate your account.`;

        // Build email message
        const msg = {
            to: email,
            from: {
                email: config.fromEmail,
                name: 'My Best Career Guidance'
            },
            subject: emailSubject,
            html: getEmailTemplate(emailGreeting, emailMessage, verificationCode, emailAction),
            // Add tracking and categories for production monitoring
            ...(IS_PRODUCTION && {
                categories: ['verification', isPreRegistration ? 'pre-registration' : 'account-verification'],
                customArgs: {
                    email_type: isPreRegistration ? 'pre_registration' : 'verification',
                    timestamp: new Date().toISOString()
                }
            })
        };

        // Send email with retry logic
        const sendEmail = async () => {
            const result = await sgMail.send(msg);
            return result;
        };

        const result = await retryWithBackoff(sendEmail);

        const duration = Date.now() - startTime;
        
        console.log('EMAIL SENT SUCCESSFULLY VIA SENDGRID');
        console.log(`Email delivered to: ${email}`);
        console.log(`Message ID: ${result[0]?.headers?.['x-message-id'] || 'N/A'}`);
        console.log(`Delivery time: ${duration}ms`);
        
        if (IS_PRODUCTION && !isLocalhost) {
            console.log('User should check their inbox (and spam folder if not found)');
        } else {
            console.log('Email sent (running in development/localhost mode)');
        }
        console.log('');

        logEmailAttempt(email, verificationCode, 'sendgrid', true);
        
        return { 
            success: true, 
            method: 'sendgrid', 
            email: email,
            messageId: result[0]?.headers?.['x-message-id']
        };

    } catch (error) {
        const duration = Date.now() - startTime;
        
        // Log the error
        logEmailAttempt(email, verificationCode, 'sendgrid', false, error);

        // Handle specific SendGrid errors
        if (error.response) {
            const errorBody = error.response.body;
            
            // Sender verification error
            if (errorBody?.errors?.some(err => 
                err.field === 'from' && err.message.includes('verified Sender Identity')
            )) {
                const currentFromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@careerguidance.ls';
                
                console.error('\nCRITICAL: Sender email not verified in SendGrid');
                console.error('   Email:', currentFromEmail);
                console.error('   Status Code:', error.code);
                console.error('\n   To fix this:');
                console.error('   1. Go to SendGrid Dashboard → Settings → Sender Authentication');
                console.error('   2. Click "Verify a Single Sender"');
                console.error('   3. Verify the email:', currentFromEmail);
                console.error('   4. Or set SENDGRID_FROM_EMAIL in .env to a verified email');
                console.error('   5. Check your email and click the verification link');
                console.error('   Documentation: https://sendgrid.com/docs/for-developers/sending-email/sender-identity/\n');
            }
            
            // Rate limit error
            if (error.code === 429) {
                console.error('SendGrid rate limit exceeded. Please wait before sending more emails.');
            }
            
            // Invalid API key
            if (error.code === 401) {
                console.error('Invalid SendGrid API key. Please check SENDGRID_API_KEY in .env');
            }
        }

        // Handle errors based on environment
        if (IS_DEVELOPMENT || isLocalhost) {
            // On localhost/development: Always show code in console as fallback
            console.log(`\n===== EMAIL SENDING FAILED - CONSOLE MODE =====`);
            console.log(`TO: ${email}`);
            console.log(`VERIFICATION CODE: ${verificationCode}`);
            console.log(`Purpose: ${isPreRegistration ? 'Pre-Registration' : 'Account Verification'}`);
            console.log('Running in development/localhost mode');
            console.log('Code is valid and stored in database');
            console.log('User can use the code shown above to continue registration\n');
            
            // Return success with code for development
            return { 
                success: true, 
                method: 'console', 
                email: email, 
                code: verificationCode,
                error: error.message 
            };
        } else {
            // In real production (not localhost): Handle differently
            console.error('Email sending failed in production. Consider implementing email queue.');
            // In a real application, you would:
            // 1. Store failed email in a queue (Redis, database, etc.)
            // 2. Have a background worker retry sending
            // 3. Alert monitoring system
            
            // Don't expose code in real production
            return { 
                success: false, 
                method: 'sendgrid', 
                email: email, 
                error: error.message
            };
        }
    }
};

/**
 * Get email HTML template
 */
const getEmailTemplate = (greeting, message, code, action) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">My Best Career Guidance</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Email Verification</p>
                </div>
                
                <!-- Content -->
                <div style="padding: 40px 30px; background: #f8fafc;">
                    <h2 style="color: #333; margin-top: 0;">${greeting}</h2>
                    <p style="color: #666; line-height: 1.6; font-size: 16px;">${message}</p>
                    
                    <!-- Verification Code Box -->
                    <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #e5e7eb;">
                        <p style="color: #666; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                        <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; background: #f0f9ff; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace;">
                            ${code}
                        </div>
                    </div>
                    
                    <!-- Warning -->
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #92400e; margin: 0; font-weight: bold; font-size: 14px;">
                            This code will expire in 10 minutes.
                        </p>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6; font-size: 16px; margin-top: 30px;">
                        ${action}
                    </p>
                    
                    <!-- Security Note -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
                            <strong>Security Notice:</strong> If you didn't request this code, please ignore this email. 
                            Never share this code with anyone.
                        </p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="background: #1f2937; padding: 20px 30px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} My Best Career Guidance Platform. All rights reserved.
                    </p>
                    <p style="color: #6b7280; font-size: 11px; margin: 5px 0 0 0;">
                        This is an automated email. Please do not reply.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = { 
    generateVerificationCode, 
    sendVerificationEmail,
    validateEmailConfig 
};
