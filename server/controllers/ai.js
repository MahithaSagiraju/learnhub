import { askDoubt, getCodingHint, generateQuiz, getRecommendation, debugCode } from "../services/gemini.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Progress from "../models/Progress.js";

export const handleDoubt = async (req, res, next) => {
  try {
    const { question, context } = req.body;
    if (!question) throw new ApiError(400, "Question is required");
    const answer = await askDoubt(question, context);
    res.json(new ApiResponse(200, { answer }));
  } catch (error) {
    next(error);
  }
};

export const handleCodingHint = async (req, res, next) => {
  try {
    const { problem, code, difficulty } = req.body;
    if (!problem) throw new ApiError(400, "Problem description is required");
    const hint = await getCodingHint(problem, code, difficulty || "easy");
    res.json(new ApiResponse(200, { hint }));
  } catch (error) {
    next(error);
  }
};

export const handleQuizGeneration = async (req, res, next) => {
  try {
    const { topic, numQuestions } = req.body;
    if (!topic) throw new ApiError(400, "Topic is required");
    const quiz = await generateQuiz(topic, numQuestions || 5);
    res.json(new ApiResponse(200, quiz));
  } catch (error) {
    next(error);
  }
};

export const handleRecommendation = async (req, res, next) => {
  try {
    const progressRecords = await Progress.find({ student: req.user.id })
      .populate("course", "title category level")
      .populate("quizResults.quiz", "title totalMarks")
      .populate("codingResults.challenge", "title difficulty");

    const userData = {
      completedCourses: progressRecords.filter((p) => p.status === "completed").length,
      inProgressCourses: progressRecords.filter((p) => p.status === "in-progress").length,
      courses: progressRecords.map((p) => ({
        title: p.course?.title,
        category: p.course?.category,
        level: p.course?.level,
        progress: p.completionPercentage,
        status: p.status,
      })),
      quizPerformance: progressRecords.flatMap((p) =>
        p.quizResults.map((q) => ({
          quiz: q.quiz?.title,
          score: q.percentage,
          passed: q.passed,
        }))
      ),
      codingSolved: progressRecords.reduce(
        (sum, p) => sum + p.codingResults.filter((c) => c.solved).length,
        0
      ),
    };

    const recommendation = await getRecommendation(userData);
    res.json(new ApiResponse(200, { recommendation }));
  } catch (error) {
    next(error);
  }
};

export const handleDebug = async (req, res, next) => {
  try {
    const { code, language, error } = req.body;
    if (!code) throw new ApiError(400, "Code is required");
    const debug = await debugCode(code, language || "javascript", error);
    res.json(new ApiResponse(200, { debug }));
  } catch (error) {
    next(error);
  }
};
