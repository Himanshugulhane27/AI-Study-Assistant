class ErrorHandler {
  static handleNotFound(req, res) {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
  }

  static handleError(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `Duplicate value for ${field}` });
    }

    if (err.name === 'MulterError') {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size exceeds 10MB limit' });
      }
      return res.status(400).json({ message: err.message });
    }

    res.status(statusCode).json({
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
}

module.exports = ErrorHandler;
