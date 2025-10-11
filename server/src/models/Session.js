import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['agent', 'borrower', 'system'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const FeedbackSchema = new mongoose.Schema(
  {
    empathy: Number,
    tone: Number,
    compliance: Number,
    summary: String,
    suggestions: [String]
  },
  { _id: false }
);

const SessionSchema = new mongoose.Schema(
  {
    persona: { type: String, default: 'default' },
    messages: { type: [MessageSchema], default: [] },
    feedback: { type: FeedbackSchema, default: null }
  },
  { timestamps: true }
);

export default mongoose.model('Session', SessionSchema);
