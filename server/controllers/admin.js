import User from "../models/User.js";
import Course from "../models/Course.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: "published" });
    const totalRevenue = (await Course.aggregate([
      { $project: { revenue: { $multiply: ["$price", { $size: "$studentsEnrolled" }] } } },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]))[0]?.total || 0;

    const enrollments = await Course.aggregate([
      { $unwind: "$studentsEnrolled" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$studentsEnrolled.enrolledAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.json(
      new ApiResponse(200, {
        stats: { totalUsers, totalStudents, totalInstructors, totalAdmins, totalCourses, publishedCourses, totalRevenue },
        enrollments,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json(new ApiResponse(200, { users, total, pages: Math.ceil(total / limit) }));
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["student", "instructor", "admin"].includes(role)) {
      throw new ApiError(400, "Invalid role");
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(200, { user }));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      throw new ApiError(400, "Cannot delete yourself");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json(new ApiResponse(200, null, "User deleted"));
  } catch (error) {
    next(error);
  }
};
