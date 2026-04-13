import api from './api.js';

export const generateMessage = (data) => api.post('/messages/generate', data);
