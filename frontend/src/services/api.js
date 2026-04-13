import axios from 'axios';

const getBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If env is set to localhost but we are accessing from a phone (192.168...), replace it
  if (envUrl && envUrl.includes('localhost') && !isLocalhost) {
    return `http://${window.location.hostname}:5000/api`;
  }
  
  return envUrl || (isLocalhost ? 'http://localhost:5000/api' : `http://${window.location.hostname}:5000/api`);
};

const api = axios.create({
  baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
