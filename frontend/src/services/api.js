import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };
};

// Authentication API calls
export const authAPI = {
  checkEmailAndSendCode: async (email) => {
    const response = await api.post('/auth/check-email', { email });
    return response.data;
  },

  verifyPreRegistrationEmail: async (email, code) => {
    const response = await api.post('/auth/verify-pre-registration', { email, code });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  verifyEmail: async (email, code) => {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  },

  resendVerificationCode: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Student API calls
export const studentAPI = {
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  getCourses: async () => {
    const response = await api.get('/student/courses');
    return response.data;
  },

  getInstitutions: async () => {
    const response = await api.get('/student/institutions');
    return response.data;
  },

  applyForCourse: async (applicationData) => {
    const response = await api.post('/student/apply', applicationData);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await api.get('/student/applications');
    return response.data;
  },

  getAdmissionResults: async () => {
    const response = await api.get('/student/admissions');
    return response.data;
  },

  selectAdmission: async (selectedApplicationId) => {
    const response = await api.post('/student/select-admission', { selectedApplicationId });
    return response.data;
  },

  uploadTranscripts: async (formData) => {
    const response = await api.post('/student/upload-transcripts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get('/student/jobs');
    return response.data;
  },

  applyForJob: async (jobId, applicationData) => {
    const response = await api.post('/student/jobs/' + jobId + '/apply', applicationData);
    return response.data;
  },
};

// Institute API calls
export const instituteAPI = {
  getDashboard: async () => {
    const response = await api.get('/institute/dashboard');
    return response.data;
  },

  getCourses: async () => {
    const response = await api.get('/institute/courses');
    return response.data;
  },

  addCourse: async (courseData) => {
    const response = await api.post('/institute/courses', courseData);
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get('/institute/applications');
    return response.data;
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await api.put('/institute/applications/' + applicationId + '/status', { status });
    return response.data;
  },
};

// Company API calls
export const companyAPI = {
  getDashboard: async () => {
    const response = await api.get('/company/dashboard');
    return response.data;
  },

  postJob: async (jobData) => {
    const response = await api.post('/company/jobs', jobData);
    return response.data;
  },

  getJobs: async () => {
    const response = await api.get('/company/jobs');
    return response.data;
  },

  getApplicants: async () => {
    const response = await api.get('/company/applicants');
    return response.data;
  },
};

// Admin API calls - ADDING THIS MISSING SERVICE
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getInstitutions: async () => {
    const response = await api.get('/admin/institutions');
    return response.data;
  },

  addInstitution: async (institutionData) => {
    const response = await api.post('/admin/institutions', institutionData);
    return response.data;
  },

  updateInstitution: async (institutionId, updateData) => {
    const response = await api.put('/admin/institutions/' + institutionId, updateData);
    return response.data;
  },

  deleteInstitution: async (institutionId) => {
    const response = await api.delete('/admin/institutions/' + institutionId);
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get('/admin/companies');
    return response.data;
  },

  approveCompany: async (companyId) => {
    const response = await api.put('/admin/companies/' + companyId + '/approve');
    return response.data;
  },

  suspendCompany: async (companyId) => {
    const response = await api.put('/admin/companies/' + companyId + '/suspend');
    return response.data;
  },

  deleteCompany: async (companyId) => {
    const response = await api.delete('/admin/companies/' + companyId);
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put('/admin/users/' + userId + '/status', { status });
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },

  getFaculties: async (institutionId) => {
    const response = await api.get('/admin/institutions/' + institutionId + '/faculties');
    return response.data;
  },

  addFaculty: async (institutionId, facultyData) => {
    const response = await api.post('/admin/institutions/' + institutionId + '/faculties', facultyData);
    return response.data;
  },

  updateFaculty: async (facultyId, updateData) => {
    const response = await api.put('/admin/faculties/' + facultyId, updateData);
    return response.data;
  },

  deleteFaculty: async (facultyId) => {
    const response = await api.delete('/admin/faculties/' + facultyId);
    return response.data;
  },

  getCourses: async (facultyId) => {
    const response = await api.get('/admin/faculties/' + facultyId + '/courses');
    return response.data;
  },

  addCourse: async (facultyId, courseData) => {
    const response = await api.post('/admin/faculties/' + facultyId + '/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, updateData) => {
    const response = await api.put('/admin/courses/' + courseId, updateData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete('/admin/courses/' + courseId);
    return response.data;
  },

  getAdmissions: async () => {
    const response = await api.get('/admin/admissions');
    return response.data;
  },

  publishAdmissions: async (applicationIds, status) => {
    const response = await api.post('/admin/admissions/publish', { applicationIds, status });
    return response.data;
  },
};

export default api;
