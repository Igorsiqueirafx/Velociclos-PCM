module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[${req.method}] ${req.originalUrl}`, err);
  res.status(status).json({ error: message });
};
