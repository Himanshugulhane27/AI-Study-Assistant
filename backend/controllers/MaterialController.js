const StudyMaterial = require('../models/StudyMaterial');
const Progress = require('../models/Progress');
const geminiService = require('../services/gemini');
const fileService = require('../services/FileService');

class MaterialController {
  async getAll(req, res) {
    try {
      const filter = { user: req.user._id };
      if (req.query.subject) filter.subject = req.query.subject;
      const materials = await StudyMaterial.find(filter)
        .populate('subject', 'name')
        .sort({ uploadDate: -1 });
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const material = await StudyMaterial.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('subject', 'name');

      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }

      await Progress.findOneAndUpdate(
        { user: req.user._id, material: material._id },
        { lastAccessed: Date.now(), completionStatus: 'in_progress' },
        { upsert: true, new: true }
      );

      res.json(material);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { title, subject, content: textContent } = req.body;
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }

      let content = textContent || '';
      let fileUrl = '';
      let fileName = '';

      if (req.file) {
        fileUrl = req.file.path;
        fileName = req.file.originalname;
        content = await fileService.extractText(req.file.path);
      }

      if (!content) {
        return res.status(400).json({ message: 'Content or file is required' });
      }

      const material = await StudyMaterial.create({
        title,
        content,
        fileUrl,
        fileName,
        user: req.user._id,
        subject: subject || undefined
      });

      await Progress.create({
        user: req.user._id,
        material: material._id,
        completionStatus: 'not_started'
      });

      const populated = await material.populate('subject', 'name');
      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async generateSummary(req, res) {
    try {
      const material = await StudyMaterial.findOne({
        _id: req.params.id,
        user: req.user._id
      });
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }

      const summary = await geminiService.generateSummary(material.content);
      material.summary = summary;
      await material.save();

      await Progress.findOneAndUpdate(
        { user: req.user._id, material: material._id },
        {
          $inc: { summariesGenerated: 1 },
          completionStatus: 'in_progress',
          lastAccessed: Date.now()
        },
        { upsert: true }
      );

      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: 'AI processing failed', error: error.message });
    }
  }

  async askQuestion(req, res) {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ message: 'Question is required' });
      }

      const material = await StudyMaterial.findOne({
        _id: req.params.id,
        user: req.user._id
      });
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }

      const answer = await geminiService.answerQuestion(material.content, question);

      await Progress.findOneAndUpdate(
        { user: req.user._id, material: material._id },
        { $inc: { questionsAsked: 1 }, lastAccessed: Date.now() },
        { upsert: true }
      );

      res.json({ question, answer });
    } catch (error) {
      res.status(500).json({ message: 'AI processing failed', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const material = await StudyMaterial.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }

      fileService.deleteFile(material.fileUrl);
      await Progress.deleteMany({ material: material._id });
      res.json({ message: 'Material deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new MaterialController();
