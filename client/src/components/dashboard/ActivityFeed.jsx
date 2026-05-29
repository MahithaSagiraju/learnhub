import { motion } from "framer-motion";
import { HiPlay, HiCode, HiAcademicCap } from "react-icons/hi";

const activityIcons = {
  lecture: HiPlay,
  quiz: HiAcademicCap,
  coding: HiCode,
};

const activityColors = {
  lecture: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  quiz: "text-green-500 bg-green-100 dark:bg-green-900/30",
  coding: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
};

const ActivityFeed = ({ activities }) => {
  if (!activities?.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <HiPlay className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || HiPlay;
        const colorClass = activityColors[activity.type] || activityColors.lecture;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.itemTitle}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {activity.courseTitle}
                {activity.score && ` - Score: ${activity.score}`}
              </p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatTimeAgo(activity.date)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

export default ActivityFeed;
