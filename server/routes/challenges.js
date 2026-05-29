import { Router } from "express";
import { getChallenges, getChallengeById, submitChallenge, runCode } from "../controllers/challenges.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.get("/", getChallenges);
router.get("/:id", getChallengeById);
router.post("/:id/submit", protect, submitChallenge);
router.post("/run", runCode);

export default router;
