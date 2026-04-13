import { parse } from 'csv-parse/sync';
import Lead from '../models/lead.model.js';

export const importFromCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
    const totalRows = records.length;
    const leads = [];

    for (const row of records) {
      // 1. Try standard Connections format (First Name + Last Name)
      let name = `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim();

      // 2. Fallback for Invitations.csv format
      if (!name) {
        if (row['Direction'] === 'OUTGOING') name = row['To'];
        else if (row['Direction'] === 'INCOMING') name = row['From'];
        else name = row['To'] || row['From'];
      }

      if (!name) continue;

      const isConnection = !!row['Connected On'];
      const status = isConnection ? 'connected' : 'invite_sent';
      const dateVal = row['Connected On'] || row['Sent At'] || 'unknown';

      let notes = `Imported from LinkedIn CSV. Date: ${dateVal}`;
      if (row['Message']) notes += `\nMessage: ${row['Message']}`;

      leads.push({
        name: name.trim(),
        company: row['Company'] || '',
        role: row['Position'] || '',
        linkedinUrl: '',
        status,
        industry: 'other',
        notes,
        createdBy: req.user._id,
      });
    }

    const invalidSkipped = totalRows - leads.length;
    let imported = 0;
    let duplicates = 0;

    try {
      const result = await Lead.insertMany(leads, { ordered: false });
      imported = result.length;
    } catch (bulkErr) {
      imported = bulkErr.insertedCount ?? bulkErr.result?.insertedCount ?? 0;
      // Count how many failures were duplicate key errors (code 11000)
      const writeErrors = bulkErr.writeErrors || bulkErr.result?.getWriteErrors?.() || [];
      duplicates = writeErrors.filter((e) => e.code === 11000).length;
    }

    res.json({ imported, duplicates, skipped: invalidSkipped, total: totalRows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

