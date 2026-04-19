const Subject = require('../models/Subject');
const StudyMaterial = require('../models/StudyMaterial');

class SubjectController {
  async getAll(req, res) {
    try {
      const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
      const subjectsWithCount = await Promise.all(
        subjects.map(async (subject) => {
          const materialCount = await StudyMaterial.countDocuments({ subject: subject._id });
          return { ...subject.toObject(), materialCount };
        })
      );
      res.json(subjectsWithCount);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Subject name is required' });
      }
      const subject = await Subject.create({ name, user: req.user._id });
      res.status(201).json(subject);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Subject already exists' });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const subject = await Subject.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { name: req.body.name },
        { new: true }
      );
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      res.json(subject);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await StudyMaterial.updateMany({ subject: req.params.id }, { $unset: { subject: '' } });
      res.json({ message: 'Subject deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new SubjectController();
