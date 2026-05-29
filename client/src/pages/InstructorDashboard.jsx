import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiBookOpen, HiUserGroup, HiAcademicCap, HiCurrencyDollar, HiPlus, HiPencil, HiTrash, HiEye } from "react-icons/hi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { instructorService } from "../services/instructorService";
import Loader from "../components/common/Loader";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await instructorService.getStats();
      setData(res.data.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await instructorService.deleteCourse(id);
      toast.success("Course deleted");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader text="Loading instructor dashboard..." />;

  const stats = [
    { icon: HiBookOpen, label: "Total Courses", value: data?.stats?.totalCourses || 0, color: "from-blue-500 to-blue-600" },
    { icon: HiUserGroup, label: "Total Students", value: data?.stats?.totalStudents || 0, color: "from-purple-500 to-purple-600" },
    { icon: HiAcademicCap, label: "Published", value: data?.stats?.publishedCourses || 0, color: "from-green-500 to-green-600" },
    { icon: HiCurrencyDollar, label: "Revenue", value: `$${data?.stats?.revenue || 0}`, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <Link
            to="/instructor/courses/create"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors"
          >
            <HiPlus className="w-5 h-5" />
            New Course
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="enrollments" name="Enrollments" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="courses" name="Courses" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Lectures</span>
                <span className="font-semibold text-gray-900 dark:text-white">{data?.stats?.totalLectures || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Quizzes</span>
                <span className="font-semibold text-gray-900 dark:text-white">{data?.stats?.totalQuizzes || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-sm text-gray-500 dark:text-gray-400">Coding Challenges</span>
                <span className="font-semibold text-gray-900 dark:text-white">{data?.stats?.totalChallenges || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Revenue</span>
                <span className="font-semibold text-green-500">${data?.stats?.revenue || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-dark-border">
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Level</th>
                  <th className="px-6 py-3 font-medium">Students</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.courses?.map((course) => (
                  <tr key={course._id} className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.category}</td>
                    <td className="px-6 py-4 text-sm capitalize">{course.level}</td>
                    <td className="px-6 py-4 text-sm">{course.studentsEnrolled}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        course.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        course.status === "draft" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/instructor/courses/${course._id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded" title="View">
                          <HiEye className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate(`/instructor/courses/${course._id}/edit`)} className="p-1.5 text-primary hover:bg-primary/10 rounded" title="Edit">
                          <HiPencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(course._id, course.title)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded" title="Delete">
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!data?.courses || data.courses.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No courses yet. Create your first course!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorDashboard;
