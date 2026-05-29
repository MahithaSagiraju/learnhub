import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { HiBookOpen, HiCode, HiChartBar, HiAcademicCap, HiClock } from "react-icons/hi";
import { fetchStudentStats } from "../redux/slices/dashboardSlice";
import StatCard from "../components/dashboard/StatCard";
import CourseCard from "../components/dashboard/CourseCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ProgressChart from "../components/dashboard/ProgressChart";
import RecommendedCard from "../components/dashboard/RecommendedCard";
import AIRecommendation from "../components/ai/AIRecommendation";
import AnimatedPage from "../components/common/AnimatedPage";
import { SkeletonStats } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, enrolledCourses, recentActivity, recommendedCourses, progressOverTime, loading } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStudentStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkeletonStats />
      </div>
    );
  }

  const statCards = [
    { icon: HiBookOpen, label: "Enrolled Courses", value: stats?.totalCourses || 0, color: "from-blue-500 to-blue-600" },
    { icon: HiCode, label: "Challenges Solved", value: stats?.totalChallengesSolved || 0, color: "from-purple-500 to-purple-600" },
    { icon: HiChartBar, label: "Avg Quiz Score", value: `${stats?.avgQuizScore || 0}%`, color: "from-green-500 to-green-600" },
    { icon: HiAcademicCap, label: "Certificates", value: stats?.totalCertificates || 0, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here's your learning overview</p>
          </div>
          {stats?.overallProgress > 0 && (
            <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-dark-card px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-border">
              <HiClock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Overall Progress</p>
                <div className="w-32 bg-gray-200 dark:bg-dark-border rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{ width: `${stats?.overallProgress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} index={index} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Activity</h2>
            <ProgressChart data={progressOverTime} />
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>

        {enrolledCourses?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {enrolledCourses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          </div>
        )}

        {recommendedCourses?.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recommended For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recommendedCourses.map((course, index) => (
                  <RecommendedCard key={course._id} course={course} index={index} />
                ))}
              </div>
            </div>
            <div>
              <AIRecommendation />
            </div>
          </div>
        )}
      </motion.div>
    </div>
    </AnimatedPage>
  );
};

export default Dashboard;
