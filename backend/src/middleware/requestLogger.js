function requestLogger(req, res, next) {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function (...args) {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    return originalSend.apply(this, args);
  };

  next();
}

module.exports = { requestLogger };
