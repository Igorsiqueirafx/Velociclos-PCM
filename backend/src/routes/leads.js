const express = require('express');
const { validateBody } = require('../middleware/validation');
const router = express.Router();

module.exports = (subscribersRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await subscribersRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  router.post('/', validateBody(['email']), async (req, res) => {
    try {
      const { email, name, phone, utm_campaign, utm_source, utm_medium, utm_content } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email inválido' });
      }

      const existing = await subscribersRepo.findByEmail(email);
      if (existing) {
        const updated = await subscribersRepo.update(existing.id, {
          name: name || existing.name,
          phone: phone || existing.phone,
          utm_campaign: utm_campaign || existing.utm_campaign,
          utm_source: utm_source || existing.utm_source,
          utm_medium: utm_medium || existing.utm_medium,
          utm_content: utm_content || existing.utm_content,
          ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || null,
          user_agent: req.headers['user-agent'] || null,
        });
        return res.json(updated);
      }

      const data = await subscribersRepo.create({
        email,
        name: name || null,
        phone: phone || null,
        utm_campaign: utm_campaign || null,
        utm_source: utm_source || 'website',
        utm_medium: utm_medium || null,
        utm_content: utm_content || null,
        source: utm_source || 'lead-capture',
        ip_address: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'] || null,
        user_agent: req.headers['user-agent'] || null,
      });
      res.status(201).json({ success: true, message: 'Lead salvo com sucesso!', data });
    } catch (error) {
      console.error('Error saving lead:', error);
      res.status(500).json({ error: 'Failed to save lead' });
    }
  });

  return router;
};
