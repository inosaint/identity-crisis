const express = require('express');
const router = express.Router();
const redis = require('../utils/redis');

router.post('/', async (req, res) => {
  const { body } = req.body;
  const sourceMessageId = req.body.sourceMessageId;

  try {
    // Decode base64 response from OpenAI
    const decoded = Buffer.from(body, 'base64').toString('utf-8');

    // Store in Redis with sourceMessageId as key
    await redis.set(sourceMessageId, decoded);

    return res.status(200).send(decoded);
  } catch (error) {
    console.error('Callback error:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
