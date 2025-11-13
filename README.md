# My Best Career Guidance Platform

A comprehensive Career Guidance and Employment Integration Web Application Platform for Lesotho.

## 🎯 Features

### Student Module
- ✅ Register with email verification
- ✅ Browse courses and institutions
- ✅ Apply for courses (maximum 2 per institution)
- ✅ Qualification-based course filtering
- ✅ Upload transcripts and certificates
- ✅ View admission results
- ✅ Select admission when multiple offers received
- ✅ Search and apply for jobs
- ✅ Receive job notifications (qualified students only)

### Institute Module
- ✅ Register with email verification
- ✅ Manage faculties and courses
- ✅ Review student applications
- ✅ Approve/reject/waitlist applications
- ✅ Prevent multiple program admissions per student
- ✅ Publish admission results
- ✅ Analytics and reports

### Company Module
- ✅ Register with email verification
- ✅ Post job opportunities with requirements
- ✅ View qualified applicants (automatic filtering)
- ✅ Filter by academic performance, certificates, experience
- ✅ Manage company profile

### Admin Module
- ✅ Manage all institutions
- ✅ Approve/suspend/delete companies
- ✅ Monitor system users
- ✅ View system reports
- ✅ Manage courses and faculties

## 🛠️ Tech Stack
- **Frontend**: React.js 18.2.0
- **Backend**: Node.js + Express.js 5.1.0
- **Database**: Firebase Firestore
- **Authentication**: JWT with email verification
- **Email Service**: SendGrid
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure
```
MyBestCareerGuidance/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Firebase configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app
│   │   └── server.js        # Server entry
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/                # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js           # Main app
│   ├── .env                 # Environment variables
│   └── package.json
├── README.md
├── SETUP.md                 # Detailed setup guide
├── DEPLOYMENT.md            # Deployment instructions
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- SendGrid account (optional, for email verification)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MyBestCareerGuidance
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file (see SETUP.md)
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create .env file (see SETUP.md)
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete local development setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment instructions

## 🔑 Key Features Implementation

### Email Verification
- All users must verify email before login
- 6-digit verification code sent via SendGrid
- Code expires in 10 minutes
- Resend verification code available

### Course Application Rules
- ✅ Maximum 2 courses per institution
- ✅ Qualification validation before application
- ✅ Students cannot apply for unqualified courses
- ✅ Application deadline checking

### Admission Management
- ✅ Institutions cannot admit same student to multiple programs
- ✅ Students with multiple admissions must select one
- ✅ Automatic removal from other institutions on selection
- ✅ Waiting list promotion when student selects elsewhere

### Job Matching
- ✅ Automatic qualification matching (matchScore ≥ 70)
- ✅ Filtering by academic performance, certificates, experience
- ✅ Only qualified students receive job notifications

## 🔐 Security Features

- JWT-based authentication
- Email verification required
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation

## 🧪 Testing

### Test Backend:
```bash
curl http://localhost:5000/api/health
```

### Test Email Verification:
1. Register a new user
2. Check email/console for verification code
3. Verify email before login

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
SENDGRID_API_KEY=your-sendgrid-key
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Recommended Platforms:**
- Frontend: Vercel, Firebase Hosting, AWS Amplify
- Backend: Railway, Firebase Cloud Functions, AWS Elastic Beanstalk

## 📄 License
MIT License

## 👥 Contributors
- Development Team

## 📞 Support
For issues or questions, please check the documentation or create an issue in the repository.
