const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' }
});

const quizSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyMaterial', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [questionSchema],
  score: { type: Number, default: null },
  totalQuestions: { type: Number, required: true },
  attempted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
