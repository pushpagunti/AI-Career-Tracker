const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allows cookies to be sent cross-origin
  })
);
const profileRoutes = require('./routes/profile.routes');
// ...
app.use('/api/profile', profileRoutes);

const skillRoutes = require('./routes/skill.routes');

app.use('/api/skills', skillRoutes);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;