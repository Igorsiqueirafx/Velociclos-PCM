const express = require('express');
const { validateBody } = require('../middleware/validation');
const router = express.Router();

module.exports = (articlesRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await articlesRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ error: 'Failed to fetch articles' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const data = await articlesRepo.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Article not found' });
      res.json(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ error: 'Failed to fetch article' });
    }
  });

  router.post('/', validateBody(['title']), async (req, res) => {
    try {
      const slug = req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : '');
      const payload = {
        title: req.body.title || '',
        slug: slug || null,
        content: req.body.content || '',
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || req.body.coverImage || '',
        category: req.body.category || '',
        tags: req.body.tags || [],
        author: req.body.author || '',
        is_published: req.body.is_published || false,
        published_at: req.body.is_published ? (req.body.published_at || new Date().toISOString()) : null,
        meta_title: req.body.meta_title || '',
        meta_description: req.body.meta_description || '',
      };

      const data = await articlesRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ error: 'Failed to create article' });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        excerpt: req.body.excerpt,
        cover_image: req.body.cover_image || req.body.coverImage,
        category: req.body.category,
        tags: req.body.tags,
        author: req.body.author,
        is_published: req.body.is_published,
        published_at: req.body.is_published ? (req.body.published_at || new Date().toISOString()) : null,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        updated_at: new Date().toISOString(),
      };

      const data = await articlesRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Article not found' });
      res.json(data);
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).json({ error: 'Failed to update article' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const result = await articlesRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Article not found' });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting article:', error);
      res.status(500).json({ error: 'Failed to delete article' });
    }
  });

  return router;
};
