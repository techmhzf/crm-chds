import { Router } from 'express';
import { getTodaysTasks } from '../controllers/task.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/today', protect, getTodaysTasks);
export default router;
