import { Router } from "express";
import { getCourseQuizzes, getQuizById, submitQuiz, getQuizResults } from "../controllers/quiz.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/course/:courseId", getCourseQuizzes);
router.get("/:id", protect, getQuizById);
router.post("/:id/submit", protect, submitQuiz);
router.get("/:id/results", protect, getQuizResults);

export default router;
