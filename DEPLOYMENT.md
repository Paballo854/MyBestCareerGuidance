# Deployment Guide - My Best Career Guidance Platform

This guide will help you deploy the Career Guidance Platform to cloud hosting platforms.

## 📋 Prerequisites

- Node.js 16+ installed
- Firebase project created
- SendGrid account (for email verification)
- GitHub account
- Cloud hosting account (Vercel, Firebase, or AWS)

---

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Firebase Configuration
# Download service account JSON from Firebase Console
# Place it as: backend/firebase-service-account.json
# DO NOT COMMIT THIS FILE!

# SendGrid Email Service
SENDGRID_API_KEY=your-sendgrid-api-key-here

# CORS Configuration (for production)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=https://your-backend-api-url.com/api
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel Dashboard:**
   - Go to your project settings
   - Add `REACT_APP_API_URL` with your backend URL

#### Backend Deployment (Vercel Serverless):

1. **Create `vercel.json` in backend directory:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   cd backend
   vercel
   ```

---

### Option 2: Firebase Hosting (Frontend) + Cloud Functions (Backend)

#### Frontend:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   cd frontend
   firebase init hosting
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

#### Backend (Firebase Cloud Functions):

1. **Initialize Functions:**
   ```bash
   cd backend
   firebase init functions
   ```

2. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

---

### Option 3: Railway (Backend) + Vercel (Frontend)

#### Backend on Railway:

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Connect GitHub repository**

3. **Add environment variables** in Railway dashboard

4. **Deploy automatically** on git push

---

### Option 4: AWS (Full Stack)

#### Frontend (AWS Amplify):

1. **Connect GitHub repository** to AWS Amplify
2. **Configure build settings:**
   - Build command: `npm run build`
   - Output directory: `build`

#### Backend (AWS Elastic Beanstalk or EC2):

1. **Create Elastic Beanstalk application**
2. **Upload backend code**
3. **Configure environment variables**
4. **Deploy**

---

## 📝 Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Firestore Database

2. **Get Service Account:**
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Download JSON file
   - Save as `backend/firebase-service-account.json`
   - **DO NOT COMMIT THIS FILE!**

3. **Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /applications/{applicationId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null;
       }
       // Add more rules as needed
     }
   }
   ```

---

## 📧 SendGrid Email Setup

1. **Create SendGrid Account:**
   - Sign up at [sendgrid.com](https://sendgrid.com)

2. **Create API Key:**
   - Go to Settings > API Keys
   - Create new API Key
   - Copy the key to your `.env` file

3. **Verify Sender Email:**
   - Go to Settings > Sender Authentication
   - Verify your sender email address

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase service account JSON file added (not committed)
- [ ] SendGrid API key configured
- [ ] Frontend API URL points to backend
- [ ] `.gitignore` includes sensitive files
- [ ] All backup files removed
- [ ] Code tested locally
- [ ] Database collections initialized

---

## 🔍 Post-Deployment Verification

1. **Test Backend:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Test registration with email verification
   - Test login
   - Test all major features

3. **Check Logs:**
   - Monitor error logs in hosting platform
   - Check Firebase console for database activity

---

## 🐛 Troubleshooting

### Backend Issues:

- **Port conflicts:** Ensure PORT environment variable is set
- **Firebase errors:** Verify service account JSON is correct
- **CORS errors:** Update CORS settings in `backend/src/app.js`

### Frontend Issues:

- **API connection:** Verify `REACT_APP_API_URL` is correct
- **Build errors:** Check Node.js version compatibility
- **Environment variables:** Ensure variables start with `REACT_APP_`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [SendGrid Documentation](https://docs.sendgrid.com)

---

## 🔐 Security Notes

1. **Never commit:**
   - `.env` files
   - `firebase-service-account.json`
   - API keys or secrets

2. **Use environment variables** for all sensitive data

3. **Enable HTTPS** on all deployments

4. **Set up proper CORS** for production

5. **Use strong JWT secrets** (at least 32 characters)

---

## 📞 Support

If you encounter issues during deployment, check:
1. Hosting platform logs
2. Browser console for frontend errors
3. Backend server logs
4. Firebase console for database errors

---

**Last Updated:** January 2025

