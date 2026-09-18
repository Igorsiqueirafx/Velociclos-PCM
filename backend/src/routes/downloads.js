const express = require('express');
const { validateBody } = require('../middleware/validation');
const { rateLimit } = require('../middleware/rateLimiter');
const { logError } = require('../middleware/logger');
const router = express.Router();

const downloadRateLimit = rateLimit({ windowMs: 60000, max: 10 });

module.exports = (downloadsRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await downloadsRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      logError('downloads:list', error);
      res.status(500).json({ error: 'Failed to fetch downloads' });
    }
  });

  router.post('/', downloadRateLimit, validateBody(['email']), async (req, res) => {
    try {
      const payload = {
        email: req.body.email || '',
        name: req.body.name || '',
        phone: req.body.phone || '',
        source: req.body.source || 'download',
        ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || null,
        user_agent: req.headers['user-agent'] || null,
      };

      const data = await downloadsRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      logError('downloads:create', error);
      res.status(500).json({ error: 'Failed to create download' });
    }
  });

  return router;
};
