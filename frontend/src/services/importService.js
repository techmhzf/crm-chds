import api from './api.js';

export const importLinkedInCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/import/linkedin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
