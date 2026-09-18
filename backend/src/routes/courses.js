const express = require('express');
const { validateBody } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const { logError } = require('../middleware/logger');
const router = express.Router();

module.exports = (coursesRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await coursesRepo.findAll({ orderBy: 'order_index', ascending: true });
      res.json(data);
    } catch (error) {
      logError('courses:list', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const data = await coursesRepo.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Course not found' });
      res.json(data);
    } catch (error) {
      logError('courses:get', error);
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  router.post('/', authMiddleware, validateBody(['title']), async (req, res) => {
    try {
      const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
      const payload = {
        title: req.body.title || '',
        slug: slug || null,
        description: req.body.description || '',
        thumbnail: req.body.thumbnail || '',
        category: req.body.category || '',
        is_published: req.body.is_published || false,
        order_index: req.body.order_index || 0,
      };

      const data = await coursesRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      logError('courses:create', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        thumbnail: req.body.thumbnail,
        category: req.body.category,
        is_published: req.body.is_published,
        order_index: req.body.order_index,
        updated_at: new Date().toISOString(),
      };

      const data = await coursesRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Course not found' });
      res.json(data);
    } catch (error) {
      logError('courses:update', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const result = await coursesRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Course not found' });
      res.status(204).send();
    } catch (error) {
      logError('courses:delete', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  return router;
};
