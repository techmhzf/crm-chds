import Lead, { isDuplicateKeyError } from '../models/lead.model.js';

// ─────────────────────────────────────────────
// Helper: find an existing lead by URL or name
// ─────────────────────────────────────────────
async function findExisting(userId, { linkedinUrl, name }) {
  const or = [];
  if (linkedinUrl?.trim()) or.push({ linkedinUrl: linkedinUrl.trim(), createdBy: userId });
  if (name?.trim())        or.push({ name: name.trim(), createdBy: userId });
  if (!or.length) return null;
  return Lead.findOne({ $or: or });
}

// ─────────────────────────────────────────────
// POST /leads  — create a new lead (from the CRM form)
// Returns 409 with { message, existing } if a duplicate is found
// ─────────────────────────────────────────────
export const createLead = async (req, res) => {
  try {
    const userId  = req.user._id;
    const { linkedinUrl, name } = req.body;

    // Pre-flight deduplication check (catches URL AND name duplicates)
    const existing = await findExisting(userId, { linkedinUrl, name });
    if (existing) {
      const byUrl  = linkedinUrl?.trim() && existing.linkedinUrl === linkedinUrl.trim();
      const reason = byUrl ? 'LinkedIn URL' : 'name';
      return res.status(409).json({
        message: `A lead with this ${reason} already exists: "${existing.name}".`,
        existing,
      });
    }

    const lead = await Lead.create({ ...req.body, createdBy: userId });
    res.status(201).json(lead);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return res.status(409).json({ message: `"${req.body.name}" already exists in your pipeline.` });
    }
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────
// POST /leads/upsert  — idempotent save for the Chrome extension
// Finds by linkedinUrl → name → creates if new.
// NEVER creates duplicates. Returns { lead, created: bool }.
// ─────────────────────────────────────────────
export const upsertLead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { linkedinUrl, name, ...rest } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    // 1. Look for an existing lead (by URL first, then name)
    const existing = await findExisting(userId, { linkedinUrl, name });

    if (existing) {
      // Update any new fields that came in (e.g. freshly scraped role/company)
      const updates = {};
      if (rest.role    && !existing.role)    updates.role    = rest.role;
      if (rest.company && !existing.company) updates.company = rest.company;
      if (linkedinUrl?.trim() && !existing.linkedinUrl) updates.linkedinUrl = linkedinUrl.trim();

      const updated = Object.keys(updates).length
        ? await Lead.findByIdAndUpdate(existing._id, updates, { new: true })
        : existing;

      return res.json({ lead: updated, created: false });
    }

    // 2. No match — create fresh lead
    const lead = await Lead.create({
      name: name.trim(),
      linkedinUrl: linkedinUrl?.trim() || '',
      ...rest,
      createdBy: userId,
    });

    res.status(201).json({ lead, created: true });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      // Race condition safety net — someone else created it between check and insert
      const existing = await findExisting(req.user._id, { linkedinUrl: req.body.linkedinUrl, name: req.body.name });
      if (existing) return res.json({ lead: existing, created: false });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    if (req.body.status && req.body.status !== lead.status) {
      req.body.lastContactedAt = Date.now();
      if (req.body.status !== 'message_sent') req.body.needsFollowUp = false;
    }
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return res.status(409).json({ message: `"${req.body.name}" already exists in your pipeline.` });
    }
    res.status(500).json({ message: err.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const update = { status: req.body.status, lastContactedAt: Date.now() };
    if (req.body.status !== 'message_sent') update.needsFollowUp = false;
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      update,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const [statusCounts, total, totalReplied, thisWeek] = await Promise.all([
      Lead.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments({ createdBy: userId }),
      Lead.countDocuments({ createdBy: userId, status: 'replied' }),
      Lead.countDocuments({ createdBy: userId, createdAt: { $gte: weekStart } }),
    ]);

    const statusMap = {
      invite_sent: 0, connected: 0, message_sent: 0, replied: 0,
      follow_up: 0, potential_client: 0, not_interested: 0,
    };
    statusCounts.forEach(({ _id, count }) => { statusMap[_id] = count; });

    res.json({ total, totalReplied, thisWeek, statusCounts: statusMap });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
