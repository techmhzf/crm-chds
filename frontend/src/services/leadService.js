import api from './api.js';

export const createLead = (data) => api.post('/leads', data);
export const getAllLeads = () => api.get('/leads');
export const updateLeadStatus = (id, status) => api.patch(`/leads/${id}/status`, { status });
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
export const getDashboardStats = () => api.get('/leads/stats');
