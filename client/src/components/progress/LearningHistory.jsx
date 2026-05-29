import { motion } from "framer-motion";
import { HiBookOpen, HiClipboardList, HiCode, HiCalendar } from "react-icons/hi";

const ICONS = {
  "book-open": HiBookOpen,
  "clipboard-list": HiClipboardList,
  code: HiCode,
  lecture: HiBookOpen,
  quiz: HiClipboardList,
  coding: HiCode,
  login: HiCalendar,
};

const COLORS = {
  lecture: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  quiz: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  coding: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30",
  login: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
};

const LearningHistory = ({ timeline }) => {
  if (!timeline?.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {timeline.slice(0, 20).map((event, index) => {
          const Icon = ICONS[event.icon] || HiCalendar;
          const colorClass = COLORS[event.type] || "text-gray-500 bg-gray-100 dark:bg-gray-800";
          const date = new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-start gap-3"
            >
              <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  {event.title || event.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {event.courseTitle && `${event.courseTitle} · `}
                  {event.score && `${event.score} · `}
                  {event.solved !== undefined && (event.solved ? "Solved" : "Attempted")}
                  {event.points && `+${event.points}pts`}
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningHistory;
