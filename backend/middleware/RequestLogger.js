class RequestLogger {
  static log(req, res, next) {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
      console.log(`${color}${method}\x1b[0m ${originalUrl} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}

module.exports = RequestLogger;
