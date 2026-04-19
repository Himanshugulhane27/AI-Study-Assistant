const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const user = await User.create({ name, email, password, role: role || 'student' });
      const token = this._generateToken(user._id);

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = this._generateToken(user._id);

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  async getProfile(req, res) {
    res.json({ user: req.user });
  }

  _generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}

module.exports = new AuthController();
