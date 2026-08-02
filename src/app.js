require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const sanitizeInput = require("./middleware/sanitize.middleware");
const { generalLimiter } = require("./middleware/rateLimiter");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const skillRoutes = require("./routes/skill.routes");
const learningRoutes = require("./routes/learning.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const codingRoutes = require("./routes/coding.routes");
const resumeRoutes = require("./routes/resume.routes");
const atsRoutes = require("./routes/ats.routes");
const careerRoutes = require("./routes/career.routes");
const roadmapRoutes = require("./routes/roadmap.routes");
const interviewRoutes = require("./routes/interview.routes");
const jobRoutes = require("./routes/job.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const notificationRoutes = require("./routes/notification.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// =====================================
// Render Proxy
// =====================================
app.set("trust proxy", 1);

// =====================================
// Security
// =====================================
app.use(helmet());
app.use(sanitizeInput);

// =====================================
// Body Parsing
// =====================================
app.use(express.json());
app.use(cookieParser());

// =====================================
// Rate Limiter
// =====================================
app.use("/api", generalLimiter);

// =====================================
// CORS
// =====================================
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

console.log("Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Rejected Origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =====================================
// Routes
// =====================================
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// =====================================
// Global Error Handler
// =====================================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;