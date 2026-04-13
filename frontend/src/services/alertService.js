import api from './api.js';
export const getFollowUpAlerts = () => api.get('/alerts/followups');
