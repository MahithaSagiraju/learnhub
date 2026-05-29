import { Router } from "express";
import {
  handleDoubt,
  handleCodingHint,
  handleQuizGeneration,
  handleRecommendation,
  handleDebug,
} from "../controllers/ai.js";
import { protect } from "../middlewares/auth.js";

const router = Router();

router.post("/doubt", protect, handleDoubt);
router.post("/hint", handleCodingHint);
router.post("/generate-quiz", protect, handleQuizGeneration);
router.get("/recommendation", protect, handleRecommendation);
router.post("/debug", handleDebug);

export default router;
