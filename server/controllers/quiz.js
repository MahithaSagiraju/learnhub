import Quiz from "../models/Quiz.js";
import Lecture from "../models/Lecture.js";
import Progress from "../models/Progress.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getCourseQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isPublished: true })
      .select("title description duration passingScore totalMarks moduleIndex attemptsAllowed")
      .sort("moduleIndex");
    res.json(new ApiResponse(200, { quizzes }));
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new ApiError(404, "Quiz not found");

    if (req.user) {
      const progress = await Progress.findOne({
        student: req.user.id,
        "quizResults.quiz": quiz._id,
      });
      const attemptCount = progress?.quizResults?.filter(
        (r) => r.quiz.toString() === quiz._id
      ).length || 0;

      if (attemptCount >= quiz.attemptsAllowed) {
        return res.json(new ApiResponse(200, {
          quiz: {
            _id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            duration: quiz.duration,
            passingScore: quiz.passingScore,
            totalMarks: quiz.totalMarks,
            attemptsAllowed: quiz.attemptsAllowed,
            questions: quiz.questions.map((q) => ({
              _id: q._id,
              question: q.question,
              options: q.options,
              marks: q.marks,
            })),
          },
          attemptsUsed: attemptCount,
          maxAttempts: quiz.attemptsAllowed,
          canAttempt: false,
        }));
      }
    }

    res.json(new ApiResponse(200, {
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        passingScore: quiz.passingScore,
        totalMarks: quiz.totalMarks,
        moduleIndex: quiz.moduleIndex,
        attemptsAllowed: quiz.attemptsAllowed,
        questions: quiz.questions.map((q) => ({
          _id: q._id,
          question: q.question,
          options: q.options,
          marks: q.marks,
        })),
      },
      canAttempt: true,
    }));
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) throw new ApiError(404, "Quiz not found");

    let score = 0;
    const gradedAnswers = quiz.questions.map((q, i) => {
      const selected = answers?.[i];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += q.marks;
      return {
        questionIndex: i,
        selectedOption: selected,
        isCorrect,
      };
    });

    const total = quiz.totalMarks;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = percentage >= quiz.passingScore;

    let progress = await Progress.findOne({ student: req.user.id, course: quiz.course });
    if (!progress) {
      progress = await Progress.create({ student: req.user.id, course: quiz.course, status: "in-progress" });
    }

    progress.quizResults.push({
      quiz: quiz._id,
      score,
      total,
      percentage,
      passed,
      attemptedAt: new Date(),
      answers: gradedAnswers,
    });

    const totalLectures = await Lecture.countDocuments({ course: quiz.course });
    const completedLectures = progress.completedLectures.length;
    progress.completionPercentage = totalLectures > 0
      ? Math.round(((completedLectures + (passed ? 1 : 0)) / totalLectures) * 100)
      : 0;

    await progress.save();

    res.json(new ApiResponse(200, {
      score,
      total,
      percentage,
      passed,
      passingScore: quiz.passingScore,
      answers: gradedAnswers,
      questions: quiz.questions.map((q) => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    }));
  } catch (error) {
    next(error);
  }
};

export const getQuizResults = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      "quizResults.quiz": req.params.id,
    }).populate("quizResults.quiz", "title totalMarks passingScore");

    const results = progress?.quizResults?.filter(
      (r) => r.quiz?._id?.toString() === req.params.id
    ) || [];

    res.json(new ApiResponse(200, { results }));
  } catch (error) {
    next(error);
  }
};
