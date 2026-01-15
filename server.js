const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// In-memory storage for jobs
const jobs = new Map();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Generate image endpoint
app.get('/api/generate', async (req, res) => {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Create job ID
  const jobId = Date.now().toString();

  // Store job as pending
  jobs.set(jobId, { status: 'pending', prompt });

  // Return job ID immediately
  res.json({ jobId });

  // Start generation in background
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    });

    // Update job with result
    jobs.set(jobId, {
      status: 'completed',
      prompt,
      image: response.data.data[0].b64_json,
    });
  } catch (error) {
    console.error('Generation error:', error);
    jobs.set(jobId, {
      status: 'failed',
      prompt,
      error: error.message,
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
