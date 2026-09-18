const express = require('express');
const { validateBody } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

module.exports = (certificatesRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await certificatesRepo.findAll({ orderBy: 'order_index', ascending: true });
      res.json(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  });

  router.post('/', authMiddleware, validateBody(['title']), async (req, res) => {
    try {
      const payload = {
        title: req.body.title || '',
        description: req.body.description || '',
        image_url: req.body.image_url || req.body.imageUrl || '',
        issue_date: req.body.issue_date || req.body.issueDate || null,
        order_index: req.body.order_index || 0,
      };

      const data = await certificatesRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating certificate:', error);
      res.status(500).json({ error: 'Failed to create certificate' });
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        description: req.body.description,
        image_url: req.body.image_url || req.body.imageUrl,
        issue_date: req.body.issue_date || req.body.issueDate,
        order_index: req.body.order_index,
      };

      const data = await certificatesRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Certificate not found' });
      res.json(data);
    } catch (error) {
      console.error('Error updating certificate:', error);
      res.status(500).json({ error: 'Failed to update certificate' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const result = await certificatesRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Certificate not found' });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      res.status(500).json({ error: 'Failed to delete certificate' });
    }
  });

  return router;
};
