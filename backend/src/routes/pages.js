const express = require('express');
const router = express.Router();

module.exports = (pagesRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await pagesRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const data = await pagesRepo.findBySlug(req.params.slug);
      if (!data) return res.status(404).json({ error: 'Page not found' });
      res.json(data);
    } catch (error) {
      console.error('Error fetching page:', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  });

  return router;
};
