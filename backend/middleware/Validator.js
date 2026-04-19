class Validator {
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static validatePassword(password) {
    return password && password.length >= 6;
  }

  static sanitizeString(str) {
    if (!str) return '';
    return str.trim().replace(/[<>]/g, '');
  }

  static validateRegistration(req, res, next) {
    const { name, email, password } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    if (!email || !Validator.validateEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!Validator.validatePassword(password)) {
      errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    req.body.name = Validator.sanitizeString(name);
    req.body.email = email.toLowerCase().trim();
    next();
  }

  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    req.body.email = email.toLowerCase().trim();
    next();
  }

  static validateMaterial(req, res, next) {
    const { title } = req.body;

    if (!title || title.trim().length < 1) {
      return res.status(400).json({ message: 'Title is required' });
    }

    req.body.title = Validator.sanitizeString(title);
    next();
  }

  static validateSubject(req, res, next) {
    const { name } = req.body;

    if (!name || name.trim().length < 1) {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    req.body.name = Validator.sanitizeString(name);
    next();
  }

  static validateQuestion(req, res, next) {
    const { question } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ message: 'Question must be at least 3 characters' });
    }

    req.body.question = Validator.sanitizeString(question);
    next();
  }
}

module.exports = Validator;
