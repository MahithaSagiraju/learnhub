import CodingChallenge from "../models/CodingChallenge.js";
import Progress from "../models/Progress.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { executeCode, runTests } from "../services/judge0.js";

export const getChallenges = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, difficulty, course } = req.query;
    const query = { isPublished: true };

    if (difficulty) query.difficulty = difficulty;
    if (course) query.course = course;

    const challenges = await CodingChallenge.find(query)
      .select("title description difficulty tags totalSubmissions totalAccepted course")
      .populate("course", "title")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await CodingChallenge.countDocuments(query);

    res.json(new ApiResponse(200, {
      challenges: challenges.map((c) => ({
        ...c.toObject(),
        acceptanceRate: c.totalSubmissions > 0 ? Math.round((c.totalAccepted / c.totalSubmissions) * 100) : 0,
      })),
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
    }));
  } catch (error) {
    next(error);
  }
};

export const getChallengeById = async (req, res, next) => {
  try {
    const challenge = await CodingChallenge.findById(req.params.id).populate("course", "title");
    if (!challenge) throw new ApiError(404, "Challenge not found");

    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({
        student: req.user.id,
        "codingResults.challenge": challenge._id,
      }).select("codingResults");
    }

    const userSubmission = progress?.codingResults?.find(
      (r) => r.challenge.toString() === challenge._id
    );

    res.json(new ApiResponse(200, {
      challenge: {
        ...challenge.toObject(),
        sampleTestCases: challenge.sampleTestCases,
        hiddenTestCases: undefined,
      },
      userSubmission,
      acceptanceRate: challenge.totalSubmissions > 0
        ? Math.round((challenge.totalAccepted / challenge.totalSubmissions) * 100)
        : 0,
    }));
  } catch (error) {
    next(error);
  }
};

export const submitChallenge = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const challenge = await CodingChallenge.findById(req.params.id);
    if (!challenge) throw new ApiError(404, "Challenge not found");

    if (!challenge.supportedLanguages.includes(language)) {
      throw new ApiError(400, `Language ${language} not supported for this challenge`);
    }

    const sampleResults = await runTests(code, language, challenge.sampleTestCases);
    const hiddenResults = await runTests(code, language, challenge.hiddenTestCases);

    const allTestCases = [...sampleResults.results, ...hiddenResults.results];
    const totalPassed = sampleResults.passed + hiddenResults.passed;
    const total = sampleResults.total + hiddenResults.total;
    const score = total > 0 ? Math.round((totalPassed / total) * 100) : 0;
    const solved = totalPassed === total;

    challenge.totalSubmissions += 1;
    if (solved) challenge.totalAccepted += 1;
    await challenge.save();

    let progress = await Progress.findOne({ student: req.user.id, "codingResults.challenge": { $ne: challenge._id } });
    if (!progress) {
      progress = await Progress.findOne({ student: req.user.id });
    }
    if (progress) {
      const existingIndex = progress.codingResults.findIndex(
        (r) => r.challenge.toString() === challenge._id
      );
      const resultEntry = {
        challenge: challenge._id,
        language,
        code,
        passedTestCases: totalPassed,
        totalTestCases: total,
        score,
        solved,
        submittedAt: new Date(),
      };

      if (existingIndex >= 0) {
        progress.codingResults[existingIndex] = resultEntry;
      } else {
        progress.codingResults.push(resultEntry);
      }
      await progress.save();
    }

    res.json(new ApiResponse(200, {
      sampleResults: sampleResults.results,
      hiddenResults: hiddenResults.results,
      totalPassed,
      total,
      score,
      solved,
    }));
  } catch (error) {
    next(error);
  }
};

export const runCode = async (req, res, next) => {
  try {
    const { code, language, input } = req.body;
    const result = await executeCode(code, language, input);
    res.json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};
