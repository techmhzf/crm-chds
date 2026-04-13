import axios from 'axios';

// In production: VITE_API_URL is set to the Render backend URL via Vercel env vars
// In development: falls back to localhost:5000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
