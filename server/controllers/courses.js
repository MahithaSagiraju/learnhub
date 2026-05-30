import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, level, search, sort = "-createdAt" } = req.query;
    const query = { status: "published" };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .select("title slug thumbnail description category level instructor price rating totalReviews studentsEnrolled tags totalDuration createdAt modules")
      .populate("instructor", "name avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);
    const categories = await Course.distinct("category", { status: "published" });

    res.json(
      new ApiResponse(200, {
        courses,
        total,
        pages: Math.ceil(total / limit),
        page: Number(page),
        categories,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("modules.lectures")
      .populate("instructor", "name email avatar bio")
      .populate("studentsEnrolled.student", "name");

    if (!course) throw new ApiError(404, "Course not found");

    const lectures = await Lecture.find({ course: course._id }).sort("order");

    let progress = null;
    if (req.user) {
      progress = await Progress.findOne({ student: req.user.id, course: course._id });
    }

    const isEnrolled = req.user
      ? course.studentsEnrolled.some((s) => s.student._id.toString() === req.user.id)
      : false;

    res.json(new ApiResponse(200, { course, lectures, progress, isEnrolled }));
  } catch (error) {
    next(error);
  }
};

export const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, "Course not found");

    if (course.studentsEnrolled.some((s) => s.student.toString() === req.user.id)) {
      throw new ApiError(400, "Already enrolled");
    }

    course.studentsEnrolled.push({ student: req.user.id });
    await course.save();

    await Progress.create({
      student: req.user.id,
      course: course._id,
      status: "in-progress",
    });

    const user = await User.findById(req.user.id);
    user.enrolledCourses.push({ course: course._id });
    await user.save();

    res.json(new ApiResponse(200, null, "Enrolled successfully"));
  } catch (error) {
    next(error);
  }
};

export const markLectureComplete = async (req, res, next) => {
  try {
    const { lectureId } = req.body;
    const courseId = req.params.id;

    let progress = await Progress.findOne({ student: req.user.id, course: courseId });
    if (!progress) {
      progress = await Progress.create({ student: req.user.id, course: courseId, status: "in-progress" });
    }

    if (!progress.completedLectures.some((l) => l.lecture.toString() === lectureId)) {
      progress.completedLectures.push({ lecture: lectureId, completedAt: new Date() });
    }

    const totalLectures = await Lecture.countDocuments({ course: courseId });
    const completedCount = progress.completedLectures.length;
    progress.completionPercentage = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

    if (progress.completionPercentage >= 100) {
      progress.status = "completed";
      progress.completedAt = new Date();
    }

    await progress.save();
    res.json(new ApiResponse(200, { progress }));
  } catch (error) {
    next(error);
  }
};
