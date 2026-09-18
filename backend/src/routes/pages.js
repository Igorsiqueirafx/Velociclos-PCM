const express = require('express');
const { validateBody } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const { logError } = require('../middleware/logger');
const router = express.Router();

module.exports = (pagesRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await pagesRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      logError('pages:list', error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const data = await pagesRepo.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Page not found' });
      res.json(data);
    } catch (error) {
      logError('pages:get', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  });

  router.get('/slug/:slug', async (req, res) => {
    try {
      const data = await pagesRepo.findBySlug(req.params.slug);
      if (!data) return res.status(404).json({ error: 'Page not found' });
      res.json(data);
    } catch (error) {
      logError('pages:getBySlug', error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  });

  router.post('/', authMiddleware, validateBody(['title']), async (req, res) => {
    try {
      const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
      const payload = {
        title: req.body.title || '',
        slug: slug || null,
        content: req.body.content || '',
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || req.body.coverImage || '',
        is_published: req.body.is_published || false,
        sort_order: req.body.sort_order || 0,
        meta_title: req.body.meta_title || '',
        meta_description: req.body.meta_description || '',
      };

      const data = await pagesRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      logError('pages:create', error);
      res.status(500).json({ error: 'Failed to create page' });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        excerpt: req.body.excerpt,
        cover_image: req.body.cover_image || req.body.coverImage,
        is_published: req.body.is_published,
        sort_order: req.body.sort_order,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        updated_at: new Date().toISOString(),
      };

      const data = await pagesRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Page not found' });
      res.json(data);
    } catch (error) {
      logError('pages:update', error);
      res.status(500).json({ error: 'Failed to update page' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const result = await pagesRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Page not found' });
      res.status(204).send();
    } catch (error) {
      logError('pages:delete', error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  });

  return router;
};
