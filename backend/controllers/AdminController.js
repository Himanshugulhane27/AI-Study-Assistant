const User = require('../models/User');
const StudyMaterial = require('../models/StudyMaterial');
const Quiz = require('../models/Quiz');
const Subject = require('../models/Subject');

class AdminController {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getSystemStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalMaterials = await StudyMaterial.countDocuments();
      const totalQuizzes = await Quiz.countDocuments();
      const totalSubjects = await Subject.countDocuments();
      const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

      res.json({
        totalUsers,
        totalMaterials,
        totalQuizzes,
        totalSubjects,
        recentUsers
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }

      await StudyMaterial.deleteMany({ user: user._id });
      await Quiz.deleteMany({ user: user._id });
      await Subject.deleteMany({ user: user._id });
      await User.findByIdAndDelete(req.params.id);

      res.json({ message: 'User and associated data deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

module.exports = new AdminController();
