const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const imageRoute = require('./routes/image');
const callbackRoute = require('./routes/callback');
const pollRoute = require('./routes/poll');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/image', imageRoute);
app.use('/api/callback', callbackRoute);
app.use('/api/poll', pollRoute);

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🪞 Identity Crisis server running on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${path.join(__dirname, '../public')}`);
});
