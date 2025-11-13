/**
 * Email Queue System for Production
 * 
 * In production, failed emails should be queued for retry.
 * This is a basic implementation - in a real application, you'd use:
 * - Redis Queue (Bull, BullMQ)
 * - AWS SQS
 * - Database-based queue
 * - RabbitMQ
 */

const { db } = require('../config/firebase');

/**
 * Add failed email to queue for retry
 */
const queueEmailForRetry = async (emailData) => {
    try {
        const queueItem = {
            email: emailData.email,
            code: emailData.code,
            firstName: emailData.firstName || 'User',
            isPreRegistration: emailData.isPreRegistration || false,
            attempts: 0,
            maxAttempts: 5,
            status: 'pending',
            createdAt: new Date().toISOString(),
            nextRetryAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // Retry in 5 minutes
            error: emailData.error || null
        };

        await db.collection('emailQueue').add(queueItem);
        console.log(`📬 Email queued for retry: ${emailData.email}`);
        
        return true;
    } catch (error) {
        console.error('Failed to queue email:', error);
        return false;
    }
};

/**
 * Process queued emails (should be run by a background worker)
 */
const processEmailQueue = async () => {
    try {
        const now = new Date().toISOString();
        
        // Get pending emails ready for retry
        const queueSnapshot = await db.collection('emailQueue')
            .where('status', '==', 'pending')
            .where('nextRetryAt', '<=', now)
            .where('attempts', '<', 5)
            .limit(10)
            .get();

        if (queueSnapshot.empty) {
            return { processed: 0, message: 'No emails to process' };
        }

        const { sendVerificationEmail } = require('./emailService');
        let processed = 0;
        let succeeded = 0;
        let failed = 0;

        for (const doc of queueSnapshot.docs) {
            const queueItem = doc.data();
            
            try {
                // Try to send email
                const result = await sendVerificationEmail(
                    queueItem.email,
                    queueItem.code,
                    queueItem.firstName,
                    queueItem.isPreRegistration
                );

                if (result.success) {
                    // Mark as sent
                    await doc.ref.update({
                        status: 'sent',
                        sentAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    succeeded++;
                } else {
                    // Increment attempts and schedule retry
                    const newAttempts = queueItem.attempts + 1;
                    await doc.ref.update({
                        attempts: newAttempts,
                        nextRetryAt: new Date(Date.now() + Math.pow(2, newAttempts) * 60 * 1000).toISOString(),
                        status: newAttempts >= queueItem.maxAttempts ? 'failed' : 'pending',
                        lastError: result.error,
                        updatedAt: new Date().toISOString()
                    });
                    failed++;
                }
                
                processed++;
            } catch (error) {
                // Update queue item with error
                await doc.ref.update({
                    attempts: queueItem.attempts + 1,
                    lastError: error.message,
                    updatedAt: new Date().toISOString()
                });
                failed++;
            }
        }

        return { processed, succeeded, failed };
    } catch (error) {
        console.error('Error processing email queue:', error);
        return { processed: 0, error: error.message };
    }
};

/**
 * Clean up old queue items (older than 24 hours)
 */
const cleanupEmailQueue = async () => {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const oldItems = await db.collection('emailQueue')
            .where('createdAt', '<', oneDayAgo)
            .where('status', 'in', ['sent', 'failed'])
            .get();

        let deleted = 0;
        for (const doc of oldItems.docs) {
            await doc.ref.delete();
            deleted++;
        }

        return { deleted };
    } catch (error) {
        console.error('Error cleaning up email queue:', error);
        return { deleted: 0, error: error.message };
    }
};

module.exports = {
    queueEmailForRetry,
    processEmailQueue,
    cleanupEmailQueue
};

