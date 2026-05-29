import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import configureCloudinary from "./config/cloudinary.js";
import errorHandler from "./middlewares/error.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
configureCloudinary();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, try again later" },
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/", limiter);

// Routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import instructorRoutes from "./routes/instructor.js";
import courseRoutes from "./routes/courses.js";
import challengeRoutes from "./routes/challenges.js";
import quizRoutes from "./routes/quiz.js";
import assignmentRoutes from "./routes/assignment.js";
import aiRoutes from "./routes/ai.js";
import progressRoutes from "./routes/progress.js";
import certificateRoutes from "./routes/certificate.js";
import adminRoutes from "./routes/admin.js";
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/certificates", certificateRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
