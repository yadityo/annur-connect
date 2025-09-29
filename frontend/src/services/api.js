import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const instance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const setToken = (token) => {
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete instance.defaults.headers.common['Authorization'];
};

export const auth = {
  register: (payload) => instance.post('/auth/register', payload).then(r => r.data),
  login: (payload) => instance.post('/auth/login', payload).then(r => r.data),
  me: () => instance.get('/auth/me').then(r => r.data),
};

export const kajian = {
  list: (params) => instance.get('/kajian', { params }).then(r => r.data),
  getById: (id) => instance.get(`/kajian/${id}`).then(r => r.data),
  register: (id) => instance.post(`/kajian/${id}/register`).then(r => r.data),
  unregister: (id) => instance.delete(`/kajian/${id}/register`).then(r => r.data),
};

export const transactions = {
  list: (params) => instance.get('/transactions', { params }).then(r => r.data),
};

export const gallery = {
  list: () => instance.get('/gallery').then(r => r.data),
};

export const reports = {
  summary: (params) => instance.get('/reports/summary', { params }).then(r => r.data),
};

export const registrations = {
  my: () => instance.get('/registrations/my').then(r => r.data),
};

export default instance;
