# Setup Guide - My Best Career Guidance Platform

Complete setup instructions for local development.

## 📋 Prerequisites

- Node.js 16+ and npm installed
- Firebase account
- Git installed

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd MyBestCareerGuidance
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-development-secret-key
JWT_EXPIRE=7d
SENDGRID_API_KEY=your-sendgrid-key-or-leave-empty-for-console-mode
```

**Firebase Setup:**
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Download service account JSON
4. Save as `backend/firebase-service-account.json`

**Start Backend:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

**Create `.env` file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🔐 Email Verification Setup

### Option 1: SendGrid (Production)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API Key
3. Add to backend `.env`: `SENDGRID_API_KEY=your-key`
4. Verify sender email in SendGrid dashboard

### Option 2: Console Mode (Development)

If `SENDGRID_API_KEY` is not set, verification codes will be printed to console:
```
📧 Verification code: 123456
```

---

## 🗄️ Database Setup

Firebase Firestore will automatically create collections on first use. The system initializes these collections:

- `users` - User accounts
- `institutions` - Educational institutions
- `courses` - Available courses
- `applications` - Student applications
- `jobPostings` - Company job postings
- `jobApplications` - Job applications
- `faculties` - Institution faculties
- `admissions` - Admission results
- `transcripts` - Student transcripts

---

## 👥 User Roles

The system supports 4 user roles:

1. **Student** - Apply for courses, upload transcripts, search jobs
2. **Institute** - Manage courses, review applications, publish admissions
3. **Company** - Post jobs, view qualified applicants
4. **Admin** - Manage all users, institutions, and companies

---

## 🧪 Testing the Application

### 1. Register a User

- Go to `http://localhost:3000/register`
- Fill in registration form
- Check email/console for verification code
- Verify email at `/verify-email` (or login will prompt)

### 2. Login

- Go to `http://localhost:3000/login`
- Use registered credentials
- You'll be redirected to role-specific dashboard

### 3. Test Features

**As Student:**
- Browse courses and institutions
- Apply for courses (max 2 per institution)
- Upload transcripts
- Search and apply for jobs

**As Institute:**
- Add faculties and courses
- Review student applications
- Approve/reject applications
- Publish admissions

**As Company:**
- Post job opportunities
- View qualified applicants
- Manage company profile

**As Admin:**
- Manage all institutions
- Approve/suspend companies
- View system reports

---

## 🐛 Common Issues

### Backend won't start:
- Check if port 5000 is available
- Verify Firebase service account JSON exists
- Check `.env` file is in `backend/` directory

### Frontend won't connect:
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Email verification not working:
- Check SendGrid API key in backend `.env`
- If no key, codes will appear in backend console
- Check email spam folder

### Firebase errors:
- Verify service account JSON is correct
- Check Firestore is enabled in Firebase console
- Ensure proper Firebase project is selected

---

## 📁 Project Structure

```
MyBestCareerGuidance/
├── backend/
│   ├── src/
│   │   ├── config/          # Firebase configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js         # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

---

## 🔧 Development Tips

1. **Use `npm run dev`** in backend for auto-reload
2. **Check browser console** for frontend errors
3. **Check backend console** for API logs
4. **Use Postman/Insomnia** to test API endpoints
5. **Firebase Console** for database inspection

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment mode
JWT_SECRET=secret-key        # JWT signing secret
JWT_EXPIRE=7d                # JWT expiration
SENDGRID_API_KEY=key         # SendGrid API key (optional)
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Next Steps

1. Complete local setup
2. Test all features
3. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
4. Push to GitHub
5. Deploy to cloud hosting

---

**Happy Coding! 🚀**

