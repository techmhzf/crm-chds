import { Router } from 'express';
import { importFromCSV } from '../controllers/import.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.post('/linkedin', protect, upload.single('file'), importFromCSV);
export default router;
