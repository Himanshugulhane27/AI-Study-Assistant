const Quiz = require('../models/Quiz');
const StudyMaterial = require('../models/StudyMaterial');
const Progress = require('../models/Progress');
const geminiService = require('../services/gemini');

class QuizController {
  async generate(req, res) {
    try {
      const { numQuestions = 5 } = req.body;
      const material = await StudyMaterial.findOne({
        _id: req.params.materialId,
        user: req.user._id
      });
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }

      const questions = await geminiService.generateQuizQuestions(material.content, numQuestions);

      const quiz = await Quiz.create({
        material: material._id,
        user: req.user._id,
        questions,
        totalQuestions: questions.length
      });

      res.status(201).json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Quiz generation failed', error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const filter = { user: req.user._id };
      if (req.query.material) filter.material = req.query.material;
      const quizzes = await Quiz.find(filter)
        .populate('material', 'title')
        .sort({ createdAt: -1 });
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const quiz = await Quiz.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('material', 'title');
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async submit(req, res) {
    try {
      const { answers } = req.body;
      const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      let score = 0;
      const results = quiz.questions.map((q, i) => {
        const isCorrect = answers[i] === q.correctAnswer;
        if (isCorrect) score++;
        return {
          question: q.question,
          selectedAnswer: answers[i],
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
          options: q.options
        };
      });

      quiz.score = score;
      quiz.attempted = true;
      await quiz.save();

      const percentage = Math.round((score / quiz.totalQuestions) * 100);

      await Progress.findOneAndUpdate(
        { user: req.user._id, material: quiz.material },
        {
          $inc: { quizzesTaken: 1 },
          quizScore: percentage,
          completionStatus: 'in_progress',
          lastAccessed: Date.now()
        },
        { upsert: true }
      );

      res.json({ score, totalQuestions: quiz.totalQuestions, percentage, results });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json({ message: 'Quiz deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new QuizController();
