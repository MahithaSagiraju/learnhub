import Progress from "../models/Progress.js";
import LearningActivity from "../models/LearningActivity.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const getTodayUTC = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

export const getProgressStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const progressRecords = await Progress.find({ student: userId })
      .populate("course", "title modules")
      .populate("quizResults.quiz", "title totalMarks")
      .populate("codingResults.challenge", "title difficulty");

    const totalLectures = progressRecords.reduce(
      (sum, p) => sum + (p.course?.modules?.reduce((s, m) => s + (m.lectures?.length || 0), 0) || 0),
      0
    );
    const completedLectures = progressRecords.reduce((sum, p) => sum + (p.completedLectures?.length || 0), 0);
    const overallCompletion = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    const completedCourses = progressRecords.filter((p) => p.status === "completed").length;
    const inProgressCourses = progressRecords.filter((p) => p.status === "in-progress").length;

    let quizScoreSum = 0;
    let quizCount = 0;
    const quizResults = [];
    progressRecords.forEach((p) => {
      p.quizResults.forEach((q) => {
        if (q.total > 0) {
          quizScoreSum += (q.score / q.total) * 100;
          quizCount++;
          quizResults.push({
            title: q.quiz?.title || "Quiz",
            score: q.score,
            total: q.total,
            percentage: Math.round((q.score / q.total) * 100),
            date: q.attemptedAt,
          });
        }
      });
    });
    const avgQuizScore = quizCount > 0 ? Math.round(quizScoreSum / quizCount) : 0;

    const codingStats = { solved: 0, attempted: 0, byDifficulty: { easy: 0, medium: 0, hard: 0 }, byLanguage: {} };
    const solvedIds = new Set();
    progressRecords.forEach((p) => {
      p.codingResults.forEach((c) => {
        if (c.solved) {
          codingStats.solved++;
          solvedIds.add(c.challenge?._id?.toString());
          const diff = c.challenge?.difficulty?.toLowerCase();
          if (diff && diff in codingStats.byDifficulty) codingStats.byDifficulty[diff]++;
        }
        codingStats.attempted++;
        const lang = c.language || "unknown";
        codingStats.byLanguage[lang] = (codingStats.byLanguage[lang] || 0) + 1;
      });
    });

    const recentActivities = await LearningActivity.findOne({ user: userId, date: getTodayUTC() });
    const todayPoints = recentActivities?.totalPoints || 0;

    const allActivities = await LearningActivity.find({ user: userId }).sort({ date: -1 }).limit(90);
    let currentStreak = 0;
    const today = getTodayUTC();
    for (let i = 0; i < allActivities.length; i++) {
      const expected = new Date(today);
      expected.setUTCDate(expected.getUTCDate() - i);
      const actDate = new Date(allActivities[i].date);
      if (actDate.getTime() === expected.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;
    const sortedAsc = [...allActivities].reverse();
    for (let i = 0; i < sortedAsc.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedAsc[i - 1].date);
        const curr = new Date(sortedAsc[i].date);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    res.json(
      new ApiResponse(200, {
        overallCompletion,
        completedCourses,
        inProgressCourses,
        completedLectures,
        totalLectures,
        avgQuizScore,
        quizCount,
        codingSolved: codingStats.solved,
        codingAttempted: codingStats.attempted,
        uniqueChallengesSolved: solvedIds.size,
        currentStreak,
        longestStreak,
        todayPoints,
        recentQuizResults: quizResults.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
        codingByDifficulty: codingStats.byDifficulty,
        codingByLanguage: codingStats.byLanguage,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getQuizHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progressRecords = await Progress.find({ student: userId })
      .populate("course", "title")
      .populate("quizResults.quiz", "title totalMarks");

    const results = [];
    progressRecords.forEach((p) => {
      p.quizResults.forEach((q) => {
        results.push({
          courseTitle: p.course?.title || "Unknown",
          quizTitle: q.quiz?.title || "Quiz",
          score: q.score,
          total: q.total,
          percentage: q.total > 0 ? Math.round((q.score / q.total) * 100) : 0,
          passed: q.passed,
          date: q.attemptedAt,
          answers: q.answers,
        });
      });
    });

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(new ApiResponse(200, { quizHistory: results }));
  } catch (error) {
    next(error);
  }
};

export const getCodingStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progressRecords = await Progress.find({ student: userId })
      .populate("codingResults.challenge", "title difficulty category");

    const byLanguage = {};
    const byDifficulty = { easy: 0, medium: 0, hard: 0 };
    const submissions = [];
    const solvedIds = new Set();

    progressRecords.forEach((p) => {
      p.codingResults.forEach((c) => {
        const lang = c.language || "unknown";
        byLanguage[lang] = (byLanguage[lang] || 0) + 1;
        const diff = c.challenge?.difficulty?.toLowerCase();
        if (diff && diff in byDifficulty) byDifficulty[diff]++;
        if (c.solved) solvedIds.add(c.challenge?._id?.toString());
        submissions.push({
          challengeTitle: c.challenge?.title || "Challenge",
          difficulty: c.challenge?.difficulty || "easy",
          language: c.language,
          passedTestCases: c.passedTestCases,
          totalTestCases: c.totalTestCases,
          solved: c.solved,
          score: c.score,
          date: c.submittedAt,
        });
      });
    });

    submissions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(
      new ApiResponse(200, {
        totalSolved: solvedIds.size,
        totalAttempted: submissions.length,
        byLanguage,
        byDifficulty,
        recentSubmissions: submissions.slice(0, 20),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const allActivities = await LearningActivity.find({ user: userId }).sort({ date: -1 }).limit(365);

    const today = getTodayUTC();
    let currentStreak = 0;
    for (let i = 0; i < allActivities.length; i++) {
      const expected = new Date(today);
      expected.setUTCDate(expected.getUTCDate() - i);
      const actDate = new Date(allActivities[i].date);
      if (actDate.getTime() === expected.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let temp = 0;
    const sortedAsc = [...allActivities].reverse();
    for (let i = 0; i < sortedAsc.length; i++) {
      if (i === 0) {
        temp = 1;
      } else {
        const prev = new Date(sortedAsc[i - 1].date);
        const curr = new Date(sortedAsc[i].date);
        const diff = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          temp++;
        } else {
          longestStreak = Math.max(longestStreak, temp);
          temp = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, temp);

    const days = allActivities.map((a) => ({
      date: a.date,
      points: a.totalPoints,
      activityCount: a.activities.length,
      types: [...new Set(a.activities.map((act) => act.type))],
    }));

    res.json(
      new ApiResponse(200, {
        currentStreak,
        longestStreak,
        days,
        recentActivities: allActivities.slice(0, 7),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getActivityTimeline = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const progressRecords = await Progress.find({ student: userId })
      .populate("course", "title")
      .populate("completedLectures.lecture", "title")
      .populate("quizResults.quiz", "title")
      .populate("codingResults.challenge", "title");

    const events = [];

    progressRecords.forEach((p) => {
      p.completedLectures.forEach((l) => {
        events.push({
          type: "lecture",
          courseTitle: p.course?.title || "Unknown",
          title: l.lecture?.title || "Lecture",
          date: l.completedAt,
          icon: "book-open",
        });
      });
      p.quizResults.forEach((q) => {
        events.push({
          type: "quiz",
          courseTitle: p.course?.title || "Unknown",
          title: q.quiz?.title || "Quiz",
          score: `${q.score}/${q.total}`,
          passed: q.passed,
          date: q.attemptedAt,
          icon: "clipboard-list",
        });
      });
      p.codingResults.forEach((c) => {
        events.push({
          type: "coding",
          courseTitle: p.course?.title || "Unknown",
          title: c.challenge?.title || "Challenge",
          solved: c.solved,
          score: c.score,
          date: c.submittedAt,
          icon: "code",
        });
      });
    });

    const activityDays = await LearningActivity.find({ user: userId })
      .sort({ date: -1 })
      .limit(30);

    activityDays.forEach((day) => {
      day.activities.forEach((a) => {
        events.push({
          type: a.type,
          title: a.details || a.type,
          date: day.date,
          points: a.points,
          icon: a.type,
        });
      });
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(new ApiResponse(200, { timeline: events.slice(0, 50) }));
  } catch (error) {
    next(error);
  }
};

export const recordActivity = async (req, res, next) => {
  try {
    const { type, reference, referenceModel, details, points } = req.body;
    const userId = req.user.id;
    const today = getTodayUTC();

    const record = await LearningActivity.findOneAndUpdate(
      { user: userId, date: today },
      {
        $push: {
          activities: { type, reference, referenceModel, details, points: points || 10 },
        },
        $inc: { totalPoints: points || 10 },
      },
      { upsert: true, new: true }
    );

    res.json(new ApiResponse(200, { activity: record }));
  } catch (error) {
    next(error);
  }
};
