import { Router } from "express";
import { getCourses, getCourseById, enrollCourse, markLectureComplete } from "../controllers/courses.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/:id/enroll", protect, enrollCourse);
router.post("/:id/complete-lecture", protect, markLectureComplete);

export default router;
