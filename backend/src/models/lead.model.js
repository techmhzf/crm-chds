import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    company: String,
    industry: { type: String },
    linkedinUrl: String,
    profileSummary: String,
    status: {
      type: String,
      enum: ['invite_sent', 'connected', 'message_sent', 'replied', 'follow_up', 'potential_client', 'not_interested'],
      default: 'invite_sent',
    },
    notes: String,
    lastContactedAt: Date,
    messageHistory: [{ message: String, sentAt: Date }],
    needsFollowUp: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// One lead per name per user
leadSchema.index({ name: 1, createdBy: 1 }, { unique: true });

// One lead per LinkedIn URL per user (sparse = allows multiple blank URLs)
leadSchema.index({ linkedinUrl: 1, createdBy: 1 }, { unique: true, sparse: true });

export const isDuplicateKeyError = (err) => err.code === 11000;

export default mongoose.model('Lead', leadSchema);
