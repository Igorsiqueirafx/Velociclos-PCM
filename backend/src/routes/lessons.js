const express = require('express');
const { validateBody } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

module.exports = (lessonsRepo, modulesRepo) => {
  router.get('/modules/:moduleId/lessons', async (req, res) => {
    try {
      const data = await lessonsRepo.findByModuleId(req.params.moduleId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  });

  router.get('/courses/:courseId/lessons', async (req, res) => {
    try {
      const data = await lessonsRepo.findByCourseId(req.params.courseId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  });

  router.post('/modules/:moduleId/lessons', authMiddleware, validateBody(['title']), async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      const module = await modulesRepo.findById(moduleId);
      if (!module) return res.status(404).json({ error: 'Module not found' });

      const payload = {
        module_id: moduleId,
        course_id: module.course_id,
        title: req.body.title || '',
        description: req.body.description || '',
        video_id: req.body.video_id || req.body.videoId || '',
        thumbnail: req.body.thumbnail || '',
        duration: req.body.duration || null,
        order_index: req.body.order_index || 0,
        is_published: req.body.is_published || false,
      };

      const data = await lessonsRepo.create(payload);
      res.status(201).json(data);
    } catch (error) {
      console.error('Error creating lesson:', error);
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  });

  router.put('/lessons/:id', authMiddleware, async (req, res) => {
    try {
      const payload = {
        title: req.body.title,
        description: req.body.description,
        video_id: req.body.video_id || req.body.videoId,
        thumbnail: req.body.thumbnail,
        duration: req.body.duration,
        order_index: req.body.order_index,
        is_published: req.body.is_published,
        updated_at: new Date().toISOString(),
      };

      const data = await lessonsRepo.update(req.params.id, payload);
      if (!data) return res.status(404).json({ error: 'Lesson not found' });
      res.json(data);
    } catch (error) {
      console.error('Error updating lesson:', error);
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  });

  router.delete('/lessons/:id', authMiddleware, async (req, res) => {
    try {
      const result = await lessonsRepo.delete(req.params.id);
      if (!result) return res.status(404).json({ error: 'Lesson not found' });
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  });

  return router;
};
