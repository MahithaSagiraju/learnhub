import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlay, HiClock } from "react-icons/hi";

const CourseCard = ({ course, index = 0 }) => {
  const statusColors = {
    "not-started": "bg-gray-500",
    "in-progress": "bg-yellow-500",
    completed: "bg-green-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-md transition-all"
    >
      <div className="relative h-40 bg-gradient-to-br from-primary to-accent">
        {course.thumbnail && (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <span className="text-white text-lg font-bold px-4 text-center">{course.title}</span>
        </div>
        <span className={`absolute top-3 right-3 ${statusColors[course.status] || "bg-gray-500"} text-white text-xs px-2 py-1 rounded-full`}>
          {course.status === "not-started" ? "Not Started" : course.status === "in-progress" ? "In Progress" : "Completed"}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-3">
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{course.category}</span>
          <span className="text-xs px-2 py-0.5 bg-purple/10 text-accent rounded-full capitalize">{course.level}</span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{course.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${course.percentage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <HiPlay className="w-4 h-4" />
            {course.completedLectures}/{course.totalLectures} lectures
          </span>
          <Link
            to={`/courses/${course._id}`}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Continue
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
