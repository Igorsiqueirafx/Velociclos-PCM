const { logError } = require('../src/middleware/logger');

let app;
let initError = null;

try {
  app = require('../server').app;
} catch (error) {
  initError = error;
  logError('server:init', error);
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
    logError('server:handler', err);
    res.status(500).json({
      error: 'Handler error',
      message: err.message,
      stack: err.stack
    });
  }
};

module.exports = handler;
