let app;
let initError = null;

try {
  app = require('../server');
} catch (error) {
  initError = error;
  console.error('Server init error:', error);
}

const handler = (req, res) => {
  if (initError || !app) {
    res.status(500).json({
      error: 'Server initialization failed',
      message: initError ? initError.message : 'App not loaded',
      stack: initError ? initError.stack : null
    });
    return;
  }
  try {
    return app(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({
      error: 'Handler error',
      message: err.message,
      stack: err.stack
    });
  }
};

module.exports = handler;
