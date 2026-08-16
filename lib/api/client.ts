import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  // Enable credentials for CORS requests
  withCredentials: false,
});

// Request interceptor to add auth token and pid header
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (for protected endpoints)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add pid header for associationManagementSystem API
      const pid = localStorage.getItem('pid');
      if (pid) {
        config.headers.pid = pid;
      }
    }
    
    // Add CORS headers for development
    if (process.env.NODE_ENV === 'development') {
      config.headers['Access-Control-Allow-Origin'] = '*';
      config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      config.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, pid';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error);
      error.message = 'Request timeout. Please check your connection and try again.';
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Network error:', error);
      error.message = 'Unable to connect to server. Please check your connection.';
    } else if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('pid');
        window.location.href = '/auth/login';
      }
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error);
      error.message = 'Server error occurred. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;