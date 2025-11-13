# 📧 Complete SendGrid Setup Guide

Step-by-step instructions to configure SendGrid for email verification.

---

## 🎯 Step 1: Create SendGrid Account

1. **Go to SendGrid Website**
   - Visit: https://signup.sendgrid.com/
   - Click "Start for Free"

2. **Sign Up**
   - Enter your email address
   - Create a password
   - Complete the signup form
   - Verify your email address

3. **Complete Account Setup**
   - Fill in company information (optional for free tier)
   - Accept terms and conditions
   - Complete the setup wizard

---

## 🔑 Step 2: Create API Key

1. **Navigate to API Keys**
   - Login to SendGrid Dashboard: https://app.sendgrid.com
   - Go to **Settings** (left sidebar)
   - Click **API Keys**

2. **Create New API Key**
   - Click **"Create API Key"** button (top right)
   - Choose **"Full Access"** or **"Restricted Access"**
   - For Restricted Access, select:
     - ✅ Mail Send (Full Access)
     - ✅ Stats (Read Access) - optional
   - Name it: `Career Guidance Platform`
   - Click **"Create & View"**

3. **⚠️ IMPORTANT: Copy API Key**
   - **Copy the API key immediately!**
   - It starts with `SG.` followed by a long string
   - Example: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **You won't be able to see it again!**
   - Save it somewhere safe

---

## ✉️ Step 3: Verify Sender Email

### Option A: Verify Single Sender (Recommended for Testing)

1. **Go to Sender Authentication**
   - In SendGrid Dashboard
   - Go to **Settings** → **Sender Authentication**
   - Click **"Verify a Single Sender"**

2. **Fill in Sender Information**
   - **From Email Address**: Your email (e.g., `yourname@gmail.com`)
   - **From Name**: `My Best Career Guidance`
   - **Reply To**: Same as From Email
   - **Company Address**: Your address
   - **City**: Your city
   - **State**: Your state
   - **Zip**: Your zip code
   - **Country**: Your country
   - **Website**: (Optional) Your website URL

3. **Submit and Verify**
   - Click **"Create"**
   - Check your email inbox
   - Look for email from SendGrid
   - Click the **verification link** in the email
   - Wait for verification to complete (usually instant)

### Option B: Domain Authentication (For Production)

If you have your own domain (e.g., `careerguidance.ls`):

1. Go to **Settings** → **Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow the DNS setup instructions
4. Add the required DNS records to your domain
5. Wait for verification (can take up to 48 hours)

---

## ⚙️ Step 4: Configure Your Backend

1. **Open your `.env` file**
   - Location: `backend/.env`
   - If it doesn't exist, create it

2. **Add SendGrid Configuration**
   ```env
   # SendGrid Email Service
   SENDGRID_API_KEY=SG.your-actual-api-key-here
   SENDGRID_FROM_EMAIL=your-verified-email@gmail.com
   ```

3. **Replace the values:**
   - `SG.your-actual-api-key-here` → Your actual API key from Step 2
   - `your-verified-email@gmail.com` → The email you verified in Step 3

4. **Example `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   
   # SendGrid Configuration
   SENDGRID_API_KEY=SG.abc123xyz789...
   SENDGRID_FROM_EMAIL=yourname@gmail.com
   ```

---

## ✅ Step 5: Test Email Sending

1. **Restart Your Server**
   ```bash
   # Stop server (Ctrl+C)
   npm start
   ```

2. **Test Registration**
   - Go to your frontend: http://localhost:3000
   - Try to register with a real email
   - Check the backend console

3. **Check for Success**
   You should see:
   ```
   ✅ EMAIL SENT SUCCESSFULLY VIA SENDGRID!
   📧 Email delivered to: user@example.com
   📨 Message ID: xxxxxx
   ```

4. **Check Email Inbox**
   - Check the email inbox you used for registration
   - Look in spam folder if not in inbox
   - You should receive a verification email with code

---

## 🔍 Step 6: Verify in SendGrid Dashboard

1. **Check Activity Feed**
   - Go to SendGrid Dashboard
   - Click **"Activity"** in left sidebar
   - You should see your sent emails
   - Green checkmark = delivered successfully

2. **Check Statistics**
   - Go to **Statistics** → **Overview**
   - See email delivery stats
   - Monitor for any issues

---

## 🐛 Troubleshooting

### Problem: "Sender email not verified"

**Solution:**
1. Make sure you verified the email in SendGrid
2. Check that `SENDGRID_FROM_EMAIL` matches the verified email exactly
3. Wait a few minutes after verification (can take time to propagate)

### Problem: "Invalid API Key"

**Solution:**
1. Check that API key starts with `SG.`
2. Make sure there are no extra spaces in `.env` file
3. Regenerate API key if needed
4. Make sure API key has "Mail Send" permission

### Problem: "Rate limit exceeded"

**Solution:**
- Free tier: 100 emails/day
- Wait 24 hours for reset
- Or upgrade to paid plan

### Problem: Email goes to spam

**Solution:**
1. Mark as "Not Spam" in email client
2. Add sender to contacts
3. For production, use domain authentication instead of single sender

### Problem: API Key not working

**Solution:**
1. Verify API key is correct (no typos)
2. Check API key hasn't been deleted
3. Regenerate API key if needed
4. Make sure API key has proper permissions

---

## 📊 SendGrid Free Tier Limits

- **100 emails/day** (free tier)
- **40,000 emails** for first 30 days (trial)
- **Single sender verification** (free)
- **Domain authentication** (free)

---

## 🔐 Security Best Practices

1. **Never commit API keys to Git**
   - Keep `.env` in `.gitignore`
   - Use environment variables in production

2. **Rotate API keys periodically**
   - Create new API key
   - Update `.env` file
   - Delete old API key

3. **Use restricted API keys**
   - Only grant necessary permissions
   - Don't use "Full Access" unless needed

4. **Monitor activity**
   - Check SendGrid activity feed regularly
   - Set up alerts for suspicious activity

---

## 📝 Quick Reference

### Your `.env` file should have:
```env
SENDGRID_API_KEY=SG.your-key-here
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
```

### Test Command:
```bash
# Restart server after updating .env
npm start
```

### Check SendGrid:
- Dashboard: https://app.sendgrid.com
- Activity Feed: Shows all sent emails
- API Keys: Settings → API Keys
- Sender Auth: Settings → Sender Authentication

---

## ✅ Checklist

- [ ] SendGrid account created
- [ ] Email address verified
- [ ] API key created and copied
- [ ] API key added to `.env` file
- [ ] `SENDGRID_FROM_EMAIL` set in `.env`
- [ ] Server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox

---

## 🆘 Still Having Issues?

1. **Check SendGrid Dashboard**
   - Activity Feed for errors
   - API Keys section for key status
   - Sender Authentication for verification status

2. **Check Backend Logs**
   - Look for error messages
   - Check console output

3. **Verify Configuration**
   ```bash
   # Check if variables are loaded (don't show actual values)
   node -e "require('dotenv').config(); console.log('API Key:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET'); console.log('From Email:', process.env.SENDGRID_FROM_EMAIL || 'NOT SET');"
   ```

4. **SendGrid Support**
   - Documentation: https://docs.sendgrid.com
   - Support: https://support.sendgrid.com

---

**Once configured, your emails will be sent directly to users' inboxes!** 🎉

