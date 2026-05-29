import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiStar, HiUser } from "react-icons/hi";

const RecommendedCard = ({ course, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-md transition-all"
    >
      <div className="h-32 bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-white font-bold text-lg px-4 text-center">{course.title}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">{course.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1"><HiUser className="w-3 h-3" />{course.instructor?.name || "Instructor"}</span>
          <span className="flex items-center gap-1"><HiStar className="w-3 h-3 text-yellow-500" />{course.rating || "New"}</span>
        </div>
        <Link
          to={`/courses/${course._id}`}
          className="block text-center text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white py-2 rounded-lg transition-colors font-medium"
        >
          View Course
        </Link>
      </div>
    </motion.div>
  );
};

export default RecommendedCard;
