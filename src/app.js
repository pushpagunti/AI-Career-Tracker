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
const learningRoutes = require('./routes/learning.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
// ...
app.use('/api/learning', learningRoutes);
app.use('/api/dashboard', dashboardRoutes);
const codingRoutes = require('./routes/coding.routes');
// ...
app.use('/api/coding', codingRoutes);

const resumeRoutes = require('./routes/resume.routes');
// ...
app.use('/api/resumes', resumeRoutes);

const atsRoutes = require('./routes/ats.routes');
// ...
app.use('/api/ats', atsRoutes);

const careerRoutes = require('./routes/career.routes');
// ...
app.use('/api/career', careerRoutes);
const roadmapRoutes = require('./routes/roadmap.routes');
// ...
app.use('/api/roadmap', roadmapRoutes);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;