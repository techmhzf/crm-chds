import api from './api.js';

export const scrapeProfile = (linkedinUrl) =>
  api.post('/scrape/linkedin', { linkedinUrl });
