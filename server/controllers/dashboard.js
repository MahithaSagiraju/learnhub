import User from "../models/User.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Certificate from "../models/Certificate.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getStudentStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const progressRecords = await Progress.find({ student: userId })
      .populate("course", "title thumbnail category level")
      .populate("completedLectures.lecture", "title duration")
      .populate("quizResults.quiz", "title totalMarks")
      .populate("codingResults.challenge", "title difficulty");

    const enrolledCourses = await Course.find({ "studentsEnrolled.student": userId })
      .select("title thumbnail category level instructor modules totalDuration")
      .populate("instructor", "name");

    const certificates = await Certificate.find({ student: userId })
      .populate("course", "title")
      .sort("-issueDate");

    const totalCourses = enrolledCourses.length;
    const totalChallengesSolved = progressRecords.reduce(
      (sum, p) => sum + p.codingResults.filter((c) => c.solved).length,
      0
    );
    const totalCertificates = certificates.length;

    let quizAvg = 0;
    let quizCount = 0;
    progressRecords.forEach((p) => {
      p.quizResults.forEach((q) => {
        if (q.total > 0) {
          quizAvg += (q.score / q.total) * 100;
          quizCount++;
        }
      });
    });
    const avgQuizScore = quizCount > 0 ? Math.round(quizAvg / quizCount) : 0;

    const totalLectures = enrolledCourses.reduce(
      (sum, c) => sum + (c.modules?.reduce((s, m) => s + (m.lectures?.length || 0), 0) || 0),
      0
    );
    const completedLectures = progressRecords.reduce(
      (sum, p) => sum + (p.completedLectures?.length || 0),
      0
    );
    const overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    const recentActivity = [];
    progressRecords.forEach((p) => {
      p.completedLectures.forEach((l) => {
        recentActivity.push({
          type: "lecture",
          courseTitle: p.course?.title || "Unknown",
          itemTitle: l.lecture?.title || "Lecture",
          date: l.completedAt,
        });
      });
      p.quizResults.forEach((q) => {
        recentActivity.push({
          type: "quiz",
          courseTitle: p.course?.title || "Unknown",
          itemTitle: q.quiz?.title || "Quiz",
          score: `${q.score}/${q.total}`,
          date: q.attemptedAt,
        });
      });
      p.codingResults.forEach((c) => {
        if (c.solved) {
          recentActivity.push({
            type: "coding",
            courseTitle: p.course?.title || "Unknown",
            itemTitle: c.challenge?.title || "Challenge",
            date: c.submittedAt,
          });
        }
      });
    });
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

    const recommendedCourses = await Course.find({
      _id: { $nin: enrolledCourses.map((c) => c._id) },
      status: "published",
    })
      .select("title thumbnail category level instructor rating totalReviews price")
      .populate("instructor", "name")
      .limit(4)
      .sort("-rating");

    res.json(
      new ApiResponse(200, {
        stats: {
          totalCourses,
          totalChallengesSolved,
          avgQuizScore,
          totalCertificates,
          overallProgress,
          completedLectures,
          totalLectures,
        },
        enrolledCourses,
        certificates,
        recentActivity: recentActivity.slice(0, 8),
        recommendedCourses,
        progressOverTime: generateProgressChartData(progressRecords),
      })
    );
  } catch (error) {
    next(error);
  }
};

const generateProgressChartData = (progressRecords) => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const currentMonth = new Date().getMonth();
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    data.push({
      month: months[monthIndex],
      lectures: 0,
      quizzes: 0,
      coding: 0,
    });
  }
  progressRecords.forEach((p) => {
    p.completedLectures.forEach((l) => {
      const date = new Date(l.completedAt);
      const monthDiff = currentMonth - date.getMonth();
      const idx = 5 - monthDiff;
      if (idx >= 0 && idx < 6) data[idx].lectures++;
    });
    p.quizResults.forEach((q) => {
      const date = new Date(q.attemptedAt);
      const monthDiff = currentMonth - date.getMonth();
      const idx = 5 - monthDiff;
      if (idx >= 0 && idx < 6) data[idx].quizzes++;
    });
    p.codingResults.forEach((c) => {
      const date = new Date(c.submittedAt);
      const monthDiff = currentMonth - date.getMonth();
      const idx = 5 - monthDiff;
      if (idx >= 0 && idx < 6) data[idx].coding++;
    });
  });
  return data;
};

export const getEnrolledCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ "studentsEnrolled.student": req.user.id })
      .select("title thumbnail category level instructor modules totalDuration studentsEnrolled")
      .populate("instructor", "name");

    const progressRecords = await Progress.find({ student: req.user.id });

    const coursesWithProgress = courses.map((course) => {
      const progress = progressRecords.find(
        (p) => p.course.toString() === course._id.toString()
      );
      const totalLectures = course.modules?.reduce(
        (sum, m) => sum + (m.lectures?.length || 0), 0
      ) || 0;
      const completedLectures = progress?.completedLectures?.length || 0;
      const percentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

      return {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        category: course.category,
        level: course.level,
        instructor: course.instructor,
        completedLectures,
        totalLectures,
        percentage,
        status: progress?.status || "not-started",
      };
    });

    res.json(new ApiResponse(200, { courses: coursesWithProgress }));
  } catch (error) {
    next(error);
  }
};
