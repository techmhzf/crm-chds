import { Router } from 'express';
import { createLead, upsertLead, getAllLeads, getLeadById, updateLead, deleteLead, updateStatus, getDashboardStats } from '../controllers/lead.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.post('/', createLead);
router.post('/upsert', upsertLead);   // idempotent — used by Chrome extension
router.get('/', getAllLeads);
router.get('/stats', getDashboardStats);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteLead);

export default router;
