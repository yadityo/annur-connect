import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001', // Change to your backend URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optionally handle unauthorized globally (e.g., logout)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

