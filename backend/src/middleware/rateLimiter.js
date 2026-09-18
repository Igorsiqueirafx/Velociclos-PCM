const rateLimits = new Map();

function getRateLimitKey(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || req.connection.remoteAddress || 'unknown';
}

function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now - record.start > windowMs) {
    rateLimits.set(key, { count: 1, start: now });
    return true;
  }

  record.count += 1;
  return record.count <= limit;
}

function rateLimit(options = {}) {
  const { windowMs = 60000, max = 10, message = 'Too many requests, please try again later.' } = options;

  return (req, res, next) => {
    const key = getRateLimitKey(req);
    const allowed = checkRateLimit(key, max, windowMs);

    if (!allowed) {
      return res.status(429).json({ error: message });
    }

    next();
  };
}

function cleanupRateLimits() {
  const now = Date.now();
  const maxAge = 3600000;
  for (const [key, record] of rateLimits.entries()) {
    if (now - record.start > maxAge) {
      rateLimits.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, 60000);

module.exports = { rateLimit };
