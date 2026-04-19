const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

subjectSchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
