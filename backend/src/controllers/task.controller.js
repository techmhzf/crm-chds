import Lead from '../models/lead.model.js';

export const getTodaysTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [toMessage, toFollowUp, newConnections] = await Promise.all([
      Lead.find({
        createdBy: userId,
        status: 'connected',
        $or: [{ messageHistory: { $exists: false } }, { messageHistory: { $size: 0 } }],
      }).sort({ createdAt: 1 }).limit(10),
      Lead.find({
        createdBy: userId,
        $or: [{ status: 'follow_up' }, { needsFollowUp: true }],
      }).sort({ lastContactedAt: 1 }).limit(10),
      Lead.find({
        createdBy: userId,
        status: 'connected',
        createdAt: { $gte: today, $lt: tomorrow },
      }),
    ]);

    const totalTasks = toMessage.length + toFollowUp.length + newConnections.length;
    res.json({ toMessage, toFollowUp, newConnections, totalTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
