const express = require('express');
const router = express.Router();
const redis = require('../utils/redis');

router.get('/', async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: 'ID parameter is required'
    });
  }

  try {
    const data = await redis.get(id);

    if (!data) {
      return res.status(404).json({
        message: 'No data found'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Poll error:', error);
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
