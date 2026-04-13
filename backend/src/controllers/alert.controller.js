import Lead from '../models/lead.model.js';

export const getFollowUpAlerts = async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user._id, needsFollowUp: true }).sort({ lastContactedAt: 1 });
    res.json({ count: leads.length, leads });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
