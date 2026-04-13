import { Router } from 'express';
import { getFollowUpAlerts } from '../controllers/alert.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/followups', protect, getFollowUpAlerts);
export default router;
