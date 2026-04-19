const Progress = require('../models/Progress');
const Quiz = require('../models/Quiz');
const StudyMaterial = require('../models/StudyMaterial');

class ProgressController {
  async getAll(req, res) {
    try {
      const progress = await Progress.find({ user: req.user._id })
        .populate('material', 'title subject uploadDate')
        .sort({ lastAccessed: -1 });
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getStats(req, res) {
    try {
      const totalMaterials = await StudyMaterial.countDocuments({ user: req.user._id });
      const totalQuizzes = await Quiz.countDocuments({ user: req.user._id });
      const attemptedQuizzes = await Quiz.countDocuments({ user: req.user._id, attempted: true });
      const progressRecords = await Progress.find({ user: req.user._id });

      const completedMaterials = progressRecords.filter(p => p.completionStatus === 'completed').length;
      const inProgressMaterials = progressRecords.filter(p => p.completionStatus === 'in_progress').length;

      const quizScores = progressRecords.filter(p => p.quizScore > 0).map(p => p.quizScore);
      const averageScore = quizScores.length > 0
        ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
        : 0;

      const totalSummaries = progressRecords.reduce((sum, p) => sum + p.summariesGenerated, 0);
      const totalQuestions = progressRecords.reduce((sum, p) => sum + p.questionsAsked, 0);

      res.json({
        totalMaterials,
        totalQuizzes,
        attemptedQuizzes,
        completedMaterials,
        inProgressMaterials,
        averageScore,
        totalSummaries,
        totalQuestions
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { completionStatus } = req.body;
      const progress = await Progress.findOneAndUpdate(
        { user: req.user._id, material: req.params.materialId },
        { completionStatus, lastAccessed: Date.now() },
        { upsert: true, new: true }
      );
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new ProgressController();
