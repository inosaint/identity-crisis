require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// In-memory storage for jobs
const jobs = new Map();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate image with Gemini
async function generateWithGemini(jobId, prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt }
            ]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Extract base64 image from response
    const imagePart = data.candidates[0].content.parts.find(
      part => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    );

    if (!imagePart) {
      throw new Error('No image found in response');
    }

    // Update job with result
    jobs.set(jobId, {
      status: 'completed',
      prompt,
      image: imagePart.inlineData.data,
    });
  } catch (error) {
    console.error('Gemini generation error:', error);
    jobs.set(jobId, {
      status: 'failed',
      prompt,
      error: error.message,
    });
  }
}

// Generate image with OpenAI
async function generateWithOpenAI(jobId, prompt) {
  try {
    const response = await fetch(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'b64_json'
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    if (!data.data || !data.data[0] || !data.data[0].b64_json) {
      throw new Error('No image found in response');
    }

    // Update job with result
    jobs.set(jobId, {
      status: 'completed',
      prompt,
      image: data.data[0].b64_json,
    });
  } catch (error) {
    console.error('OpenAI generation error:', error);
    jobs.set(jobId, {
      status: 'failed',
      prompt,
      error: error.message,
    });
  }
}

// Generate image endpoint
app.get('/api/generate', async (req, res) => {
  const { prompt, provider = 'openai' } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Validate provider and API key
  if (provider === 'gemini' && !GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  if (provider === 'openai' && !OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  // Create job ID
  const jobId = Date.now().toString();

  // Store job as pending
  jobs.set(jobId, { status: 'pending', prompt, provider });

  // Return job ID immediately
  res.json({ jobId });

  // Start generation in background based on provider
  if (provider === 'gemini') {
    generateWithGemini(jobId, prompt);
  } else if (provider === 'openai') {
    generateWithOpenAI(jobId, prompt);
  } else {
    jobs.set(jobId, {
      status: 'failed',
      prompt,
      error: `Unknown provider: ${provider}`,
    });
  }
});

// Poll for job status
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', jobs: jobs.size });
});

// Start server
app.listen(PORT, () => {
  console.log(`🪞 Identity Crisis server running on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
});

// Cleanup old jobs (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [jobId, job] of jobs.entries()) {
    const age = now - parseInt(jobId);
    // Remove jobs older than 1 hour
    if (age > 60 * 60 * 1000) {
      jobs.delete(jobId);
    }
  }
}, 10 * 60 * 1000);
