import { HiFire, HiCalendar } from "react-icons/hi";

const StreakTracker = ({ streak }) => {
  if (!streak) return null;

  const { currentStreak, longestStreak, days } = streak;

  const generateGrid = () => {
    const grid = [];
    const today = new Date();
    for (let i = 49; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayData = days?.find((day) => {
        const dayDate = new Date(day.date).toISOString().split("T")[0];
        return dayDate === dateStr;
      });
      grid.push({
        date: dateStr,
        active: !!dayData,
        points: dayData?.points || 0,
        dayOfWeek: d.getDay(),
      });
    }
    return grid;
  };

  const grid = generateGrid();
  const dayLabels = ["Mon", "Wed", "Fri"];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Streak</h3>
      <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <HiFire className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Current: </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{currentStreak}d</span>
          </div>
          <div className="flex items-center gap-2">
            <HiCalendar className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Longest: </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{longestStreak}d</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex gap-0.5">
            {grid.map((day, i) => (
              <div
                key={day.date}
                title={`${day.date} - ${day.active ? `${day.points}pts` : "No activity"}`}
                className={`w-2.5 h-2.5 rounded-sm ${
                  day.active
                    ? "bg-primary dark:bg-primary-light"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gray-200 dark:bg-gray-700 align-middle mr-1" /> No activity
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary dark:bg-primary-light align-middle mx-1 ml-3" /> Active
        </p>
      </div>
    </div>
  );
};

export default StreakTracker;
