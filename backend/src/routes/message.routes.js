import { Router } from 'express';
import { generateMessage } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/generate', protect, generateMessage);

export default router;
