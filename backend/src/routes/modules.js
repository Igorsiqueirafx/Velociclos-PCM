const express = require('express');
const { validateBody } = require('../middleware/validation');
const router = express.Router();

module.exports = (modulesRepo, lessonsRepo) => {
  router.get('/courses/:courseId/modules', async (req, res) => {
    try {
      const data = await modulesRepo.findByCourseId(req.params.courseId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      res.status(500).json({ error: 'Failed to fetch modules' });
    }
  });

  router.post('/courses/:courseId/modules', validateBody(['title']), async (req, res) => {
    try {
      const payload = {
        course_id: req.params.courseId,
        title: req.body.title || '',
        description: req.body.description || '',
        order_index: req.body.order_index || 0,
      };

      const data = await modulesRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating module:', error);
      res.status(500).json({ error: 'Failed to create module' });
    }
  });

  router.get('/modules/:id', async (req, res) => {
    try {
      const data = await modulesRepo.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Module not found' });
      res.json(data);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: 'Failed to fetch module' });
    }
  });

  router.put('/modules/:id', async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        description: req.body.description,
        order_index: req.body.order_index,
        updated_at: new Date().toISOString(),
      };

      const data = await modulesRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Module not found' });
      res.json(data);
    } catch (error) {
      console.error('Error updating module:', error);
      res.status(500).json({ error: 'Failed to update module' });
    }
  });

  router.delete('/modules/:id', async (req, res) => {
    try {
      const result = await modulesRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Module not found' });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting module:', error);
      res.status(500).json({ error: 'Failed to delete module' });
    }
  });

  return router;
};
