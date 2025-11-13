# Email Verification Setup Guide

## 📧 How Email Verification Works

The verification code is **automatically sent directly to the email address** that the user enters during registration.

### Flow:
1. User enters their email address
2. System checks if email is already registered
3. If email is available, a 6-digit verification code is generated
4. **Code is sent directly to the user's email address** via SendGrid
5. User enters the code to verify
6. User completes registration

---

## 🔧 SendGrid Configuration

### Step 1: Create SendGrid Account
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your account

### Step 2: Create API Key
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `Career Guidance Platform`
4. Select **Full Access** or **Restricted Access** (with Mail Send permission)
5. **Copy the API key immediately** (you won't see it again!)

### Step 3: Verify Sender Email
1. Go to **Settings** → **Sender Authentication**
2. Click **Verify a Single Sender**
3. Fill in your details:
   - **From Email**: `noreply@yourdomain.com` (or your email)
   - **From Name**: `My Best Career Guidance`
   - Complete all required fields
4. Check your email and click the verification link

### Step 4: Add to Environment Variables

Add to your `backend/.env` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Important:** 
- Replace `your-api-key-here` with your actual SendGrid API key
- Replace `noreply@yourdomain.com` with your verified sender email
- Never commit the `.env` file to Git!

---

## ✅ Testing Email Sending

### With SendGrid Configured:
1. Start your backend server
2. Try registering with a real email address
3. Check the email inbox (and spam folder)
4. You should receive a beautifully formatted email with the verification code

### Without SendGrid (Development Mode):
- If `SENDGRID_API_KEY` is not set, the code will be printed to the console
- Check your backend console for: `📧 Verification code for [email]: [code]`
- You can still test the flow using the console code

---

## 📨 Email Template

The verification email includes:
- ✅ Professional HTML design
- ✅ Large, easy-to-read verification code
- ✅ Clear instructions
- ✅ Expiration warning (10 minutes)
- ✅ Security notice

---

## 🐛 Troubleshooting

### Email Not Received?

1. **Check Spam Folder**
   - Emails sometimes go to spam initially
   - Mark as "Not Spam" if found

2. **Verify SendGrid Configuration**
   ```bash
   # Check if API key is set
   echo $SENDGRID_API_KEY
   ```

3. **Check Backend Logs**
   - Look for: `✅ EMAIL SENT SUCCESSFULLY VIA SENDGRID!`
   - Or: `❌ SendGrid Error Details:`

4. **Verify Sender Email**
   - Make sure sender email is verified in SendGrid
   - Check SendGrid dashboard for delivery status

5. **Check SendGrid Activity**
   - Go to SendGrid Dashboard → Activity
   - See if emails are being sent
   - Check for any errors

### Common Errors:

**Error: "Invalid API Key"**
- Double-check your API key in `.env`
- Make sure there are no extra spaces
- Regenerate API key if needed

**Error: "Sender not verified"**
- Verify your sender email in SendGrid
- Wait for verification email and click link

**Error: "Rate limit exceeded"**
- Free tier: 100 emails/day
- Upgrade plan or wait for reset

---

## 🔒 Security Best Practices

1. **Never commit API keys** to Git
2. **Use environment variables** for all secrets
3. **Rotate API keys** periodically
4. **Monitor SendGrid activity** for suspicious emails
5. **Set up email alerts** for failed deliveries

---

## 📊 Email Delivery Status

You can check email delivery status in:
- **SendGrid Dashboard** → **Activity Feed**
- Shows: Sent, Delivered, Opened, Bounced, etc.

---

## 💡 Development Tips

1. **Use console mode** for local development (no SendGrid needed)
2. **Use real emails** for testing to see actual delivery
3. **Check console logs** for verification codes during development
4. **Test with multiple email providers** (Gmail, Outlook, etc.)

---

## 📞 Support

If you encounter issues:
1. Check SendGrid documentation: [docs.sendgrid.com](https://docs.sendgrid.com)
2. Review backend console logs
3. Check SendGrid Activity Feed
4. Verify environment variables are set correctly

---

**Last Updated:** January 2025

