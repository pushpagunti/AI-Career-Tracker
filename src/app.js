const express = require('express');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Middleware
app.use(express.json()); // parses incoming JSON request bodies

// Routes
app.use('/api/health', healthRoutes);

module.exports = app;