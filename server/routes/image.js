const express = require('express');
const router = express.Router();

const QSTASH = 'https://qstash.upstash.io/v1/publish/';
const DALL_E = 'https://api.openai.com/v1/images/generations';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

router.get('/', async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      message: 'Prompt is required',
      type: 'Bad Request'
    });
  }

  try {
    const response = await fetch(`${QSTASH}${DALL_E}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.QSTASH_TOKEN}`,
        'upstash-forward-Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Upstash-Callback': `${APP_URL}/api/callback`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });

    const json = await response.json();
    return res.status(202).json({ id: json.messageId });
  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({
      message: error.message,
      type: 'Internal server error'
    });
  }
});

module.exports = router;
