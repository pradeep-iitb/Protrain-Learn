import mongoose from 'mongoose';

const LevelScoreSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    attempts: { type: Number, default: 1 },
    bestScore: { type: Number, required: true },
    firstAttemptAt: { type: Date, default: Date.now },
    lastAttemptAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const LessonProgressSchema = new mongoose.Schema(
  {
    lessonId: { type: Number, required: true },
    currentLevel: { type: Number, default: 1 },
    levelsCompleted: [{ type: Number }],
    levelScores: { type: Map, of: LevelScoreSchema },
    totalAttempts: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    timeSpentMinutes: { type: Number, default: 0 }
  },
  { _id: false }
);

const UserProgressSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, index: true },
    email: { type: String, default: null },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [{ type: String }],
    lessons: { type: Map, of: LessonProgressSchema },
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Update lastUpdated on save
UserProgressSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model('UserProgress', UserProgressSchema);
