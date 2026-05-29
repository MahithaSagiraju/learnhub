import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";
import Quiz from "../models/Quiz.js";
import CodingChallenge from "../models/CodingChallenge.js";
import Assignment from "../models/Assignment.js";
import Progress from "../models/Progress.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getInstructorStats = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map((c) => c._id);

    const totalCourses = courses.length;
    const publishedCourses = courses.filter((c) => c.status === "published").length;
    const totalStudents = new Set(
      courses.flatMap((c) => c.studentsEnrolled.map((s) => s.student.toString()))
    ).size;

    const totalLectures = await Lecture.countDocuments({ course: { $in: courseIds } });
    const totalQuizzes = await Quiz.countDocuments({ course: { $in: courseIds } });
    const totalChallenges = await CodingChallenge.countDocuments({ course: { $in: courseIds } });

    const revenue = courses.reduce((sum, c) => sum + c.price * c.studentsEnrolled.length, 0);

    const monthlyData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthCourses = courses.filter((c) => {
        const d = new Date(c.createdAt);
        return d.getMonth() === monthIndex && d.getFullYear() === new Date().getFullYear();
      });
      monthlyData.push({
        month: months[monthIndex],
        enrollments: monthCourses.reduce((sum, c) => sum + c.studentsEnrolled.length, 0),
        courses: monthCourses.length,
      });
    }

    res.json(
      new ApiResponse(200, {
        stats: { totalCourses, publishedCourses, totalStudents, totalLectures, totalQuizzes, totalChallenges, revenue },
        courses: courses.map((c) => ({
          _id: c._id,
          title: c.title,
          category: c.category,
          level: c.level,
          status: c.status,
          studentsEnrolled: c.studentsEnrolled.length,
          price: c.price,
          rating: c.rating,
          createdAt: c.createdAt,
        })),
        monthlyData,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, price, tags } = req.body;
    const course = await Course.create({
      title,
      description,
      category,
      level,
      price,
      tags,
      instructor: req.user.id,
    });
    res.status(201).json(new ApiResponse(201, { course }));
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) throw new ApiError(404, "Course not found");
    res.json(new ApiResponse(200, { course }));
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user.id });
    if (!course) throw new ApiError(404, "Course not found");
    await Lecture.deleteMany({ course: course._id });
    await Quiz.deleteMany({ course: course._id });
    await CodingChallenge.deleteMany({ course: course._id });
    await Assignment.deleteMany({ course: course._id });
    await Progress.deleteMany({ course: course._id });
    res.json(new ApiResponse(200, null, "Course deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCourseDetails = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user.id })
      .populate("modules.lectures")
      .populate("instructor", "name email");
    if (!course) throw new ApiError(404, "Course not found");

    const lectures = await Lecture.find({ course: course._id }).sort("order");
    const quizzes = await Quiz.find({ course: course._id });
    const challenges = await CodingChallenge.find({ course: course._id });
    const assignments = await Assignment.find({ course: course._id });

    res.json(new ApiResponse(200, { course, lectures, quizzes, challenges, assignments }));
  } catch (error) {
    next(error);
  }
};

export const addLecture = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user.id });
    if (!course) throw new ApiError(404, "Course not found");

    const lecture = await Lecture.create({ ...req.body, course: course._id });

    const moduleIndex = req.body.moduleIndex || 0;
    if (!course.modules[moduleIndex]) {
      course.modules[moduleIndex] = { title: `Module ${moduleIndex + 1}`, order: moduleIndex, lectures: [] };
    }
    course.modules[moduleIndex].lectures.push(lecture._id);
    course.totalDuration += lecture.duration || 0;
    await course.save();

    res.status(201).json(new ApiResponse(201, { lecture }));
  } catch (error) {
    next(error);
  }
};

export const updateLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOneAndUpdate(
      { _id: req.params.id, course: { $in: (await Course.find({ instructor: req.user.id })).map((c) => c._id) } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!lecture) throw new ApiError(404, "Lecture not found");
    res.json(new ApiResponse(200, { lecture }));
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const lecture = await Lecture.findOneAndDelete({
      _id: req.params.id,
      course: { $in: (await Course.find({ instructor: req.user.id })).map((c) => c._id) },
    });
    if (!lecture) throw new ApiError(404, "Lecture not found");

    await Course.updateOne(
      { _id: lecture.course },
      { $pull: { "modules.$[].lectures": lecture._id }, $inc: { totalDuration: -lecture.duration } }
    );

    res.json(new ApiResponse(200, null, "Lecture deleted"));
  } catch (error) {
    next(error);
  }
};

export const createQuiz = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user.id });
    if (!course) throw new ApiError(404, "Course not found");
    const quiz = await Quiz.create({ ...req.body, course: course._id });
    res.status(201).json(new ApiResponse(201, { quiz }));
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, course: { $in: (await Course.find({ instructor: req.user.id })).map((c) => c._id) } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!quiz) throw new ApiError(404, "Quiz not found");
    res.json(new ApiResponse(200, { quiz }));
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOneAndDelete({
      _id: req.params.id,
      course: { $in: (await Course.find({ instructor: req.user.id })).map((c) => c._id) },
    });
    if (!quiz) throw new ApiError(404, "Quiz not found");
    res.json(new ApiResponse(200, null, "Quiz deleted"));
  } catch (error) {
    next(error);
  }
};

export const createCodingChallenge = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user.id });
    if (!course) throw new ApiError(404, "Course not found");
    const challenge = await CodingChallenge.create({ ...req.body, course: course._id });
    res.status(201).json(new ApiResponse(201, { challenge }));
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req, res, next) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user.id });
    if (!course) throw new ApiError(404, "Course not found");
    const assignment = await Assignment.create({ ...req.body, course: course._id });
    res.status(201).json(new ApiResponse(201, { assignment }));
  } catch (error) {
    next(error);
  }
};
