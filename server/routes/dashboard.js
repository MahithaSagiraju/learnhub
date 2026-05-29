import { Router } from "express";
import { getStudentStats, getEnrolledCourses } from "../controllers/dashboard.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/student/stats", protect, getStudentStats);
router.get("/student/courses", protect, getEnrolledCourses);

export default router;
