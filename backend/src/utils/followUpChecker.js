import Lead from '../models/lead.model.js';

export const checkFollowUps = async () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const result = await Lead.updateMany(
    { status: 'message_sent', lastContactedAt: { $lt: threeDaysAgo }, needsFollowUp: { $ne: true } },
    { $set: { needsFollowUp: true } }
  );
  console.log(`[FollowUp Checker] Flagged ${result.modifiedCount} leads`);
  return result.modifiedCount;
};
