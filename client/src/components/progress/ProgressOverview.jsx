import { motion } from "framer-motion";
import {
  HiAcademicCap, HiChartBar, HiCode, HiCalendar,
} from "react-icons/hi";

const ProgressOverview = ({ stats }) => {
  if (!stats) return null;
  const cards = [
    { icon: HiAcademicCap, label: "Course Completion", value: `${stats.overallCompletion}%`, color: "from-blue-500 to-blue-600" },
    { icon: HiChartBar, label: "Avg Quiz Score", value: `${stats.avgQuizScore}%`, color: "from-purple-500 to-purple-600" },
    { icon: HiCode, label: "Challenges Solved", value: stats.uniqueChallengesSolved, color: "from-cyan-500 to-cyan-600" },
    { icon: HiCalendar, label: "Day Streak", value: `${stats.currentStreak} days`, color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm border border-gray-200 dark:border-dark-border"
        >
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${card.color} mb-3`}>
            <card.icon className="w-5 h-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ProgressOverview;
