const express = require('express');
const { rateLimit } = require('../middleware/rateLimiter');
const { logError } = require('../middleware/logger');
const router = express.Router();

const subscriberRateLimit = rateLimit({ windowMs: 60000, max: 5 });

module.exports = (subscribersRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await subscribersRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      logError('subscribers:list', error);
      res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
  });

  router.post('/', subscriberRateLimit, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const existing = await subscribersRepo.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const data = await subscribersRepo.create({ email, source: 'website' });
      res.status(201).json(data);
    } catch (error) {
      logError('subscribers:create', error);
      res.status(500).json({ error: 'Failed to save subscriber' });
    }
  });

  return router;
};
