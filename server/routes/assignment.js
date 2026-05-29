import { Router } from "express";
import { getCourseAssignments, getAssignmentById, submitAssignment, gradeSubmission } from "../controllers/assignment.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/course/:courseId", getCourseAssignments);
router.get("/:id", protect, getAssignmentById);
router.post("/:id/submit", protect, submitAssignment);
router.put("/:id/grade/:submissionId", protect, authorize("instructor", "admin"), gradeSubmission);

export default router;
