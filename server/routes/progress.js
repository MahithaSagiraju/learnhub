import { Router } from "express";
import {
  getProgressStats,
  getQuizHistory,
  getCodingStats,
  getStreak,
  getActivityTimeline,
  recordActivity,
} from "../controllers/progress.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/stats", protect, getProgressStats);
router.get("/quiz-history", protect, getQuizHistory);
router.get("/coding-stats", protect, getCodingStats);
router.get("/streak", protect, getStreak);
router.get("/activity-timeline", protect, getActivityTimeline);
router.post("/activity", protect, recordActivity);

export default router;
