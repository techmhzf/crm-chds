import api from './api.js';
export const getTodaysTasks = () => api.get('/tasks/today');
