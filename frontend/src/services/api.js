import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
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

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// Student API calls
export const studentAPI = {
  getDashboard: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  applyForCourse: async (applicationData) => {
    const response = await api.post('/student/apply', applicationData);
    return response.data;
  },

  getApplications: async () => {
    const response = await api.get('/student/applications');
    return response.data;
  }
};

export default api;
