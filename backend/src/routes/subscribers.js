const express = require('express');
const router = express.Router();

module.exports = (subscribersRepo) => {
  router.get('/', async (req, res) => {
    try {
      const data = await subscribersRepo.findAll({ orderBy: 'created_at', ascending: false });
      res.json(data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
  });

  return router;
};
