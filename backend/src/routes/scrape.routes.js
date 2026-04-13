import express from 'express';
import { scrapeLinkedInProfile } from '../controllers/scrape.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/linkedin', protect, scrapeLinkedInProfile);

export default router;
