const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyMaterial', required: true },
  completionStatus: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  quizScore: { type: Number, default: 0 },
  quizzesTaken: { type: Number, default: 0 },
  summariesGenerated: { type: Number, default: 0 },
  questionsAsked: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

progressSchema.index({ user: 1, material: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
