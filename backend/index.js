import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import authRoutes from './src/routes/auth.routes.js';
import leadRoutes from './src/routes/lead.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import taskRoutes from './src/routes/task.routes.js';
import importRoutes from './src/routes/import.routes.js';
import scrapeRoutes from './src/routes/scrape.routes.js';
import { checkFollowUps } from './src/utils/followUpChecker.js';
import Lead from './src/models/lead.model.js';

// ─────────────────────────────────────────────────────────
// One-time dedup: removes duplicate leads by LinkedIn URL
// (keeping the oldest per user) so the sparse unique index
// can be created cleanly on startup.
// ─────────────────────────────────────────────────────────
async function cleanDuplicates() {
  try {
    const dupes = await Lead.aggregate([
      { $match: { linkedinUrl: { $nin: [null, ''] } } },
      { $group: {
          _id: { linkedinUrl: '$linkedinUrl', createdBy: '$createdBy' },
          ids: { $push: '$_id' },
          count: { $sum: 1 },
      }},
      { $match: { count: { $gt: 1 } } },
    ]);

    let removed = 0;
    for (const { ids } of dupes) {
      // Keep the first (oldest — array is insertion order), delete the rest
      const [, ...toDelete] = ids;
      await Lead.deleteMany({ _id: { $in: toDelete } });
      removed += toDelete.length;
    }

    if (removed > 0) {
      console.log(`[Dedup] Removed ${removed} duplicate lead(s) by LinkedIn URL.`);
    }
  } catch (err) {
    console.error('[Dedup] Error during cleanup:', err.message);
  }
}

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow everything (Postman, Chrome Extensions, Phone local IP testing)
    callback(null, true);
  },
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await cleanDuplicates();          // remove URL dupes before index enforces uniqueness
    cron.schedule('0 9 * * *', checkFollowUps);
    console.log('[Cron] Follow-up checker scheduled for 9:00 AM daily');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'CH Digital Solutions CRM' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/import', importRoutes);
app.use('/api/scrape', scrapeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
