import { Router } from "express";
import {
  getInstructorStats,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseDetails,
  addLecture,
  updateLecture,
  deleteLecture,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createCodingChallenge,
  createAssignment,
} from "../controllers/instructor.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.use(protect, authorize("instructor", "admin"));

router.get("/stats", getInstructorStats);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses/:id", getCourseDetails);
router.post("/courses/:courseId/lectures", addLecture);
router.put("/lectures/:id", updateLecture);
router.delete("/lectures/:id", deleteLecture);
router.post("/courses/:courseId/quizzes", createQuiz);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);
router.post("/courses/:courseId/challenges", createCodingChallenge);
router.post("/courses/:courseId/assignments", createAssignment);

export default router;
