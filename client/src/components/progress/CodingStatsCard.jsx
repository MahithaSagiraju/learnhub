import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const CodingStatsCard = ({ stats }) => {
  if (!stats) return null;
  const difficulties = [
    { key: "easy", label: "Easy", color: "text-emerald-500" },
    { key: "medium", label: "Medium", color: "text-yellow-500" },
    { key: "hard", label: "Hard", color: "text-red-500" },
  ];

  const languages = Object.entries(stats.byLanguage || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coding Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">By Difficulty</p>
          <div className="space-y-2">
            {difficulties.map((d) => (
              <div key={d.key} className="flex items-center justify-between">
                <span className={`text-sm font-medium ${d.color}`}>{d.label}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {stats.byDifficulty?.[d.key] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">By Language</p>
          {languages.length === 0 ? (
            <p className="text-xs text-gray-400">No submissions yet</p>
          ) : (
            <div className="space-y-2">
              {languages.map(([lang, count]) => (
                <div key={lang} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">{lang}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <HiCheckCircle className="w-5 h-5 text-emerald-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{stats.totalSolved} Solved</span>
        </div>
        <div className="flex items-center gap-2">
          <HiXCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{stats.totalAttempted - stats.totalSolved} Attempted</span>
        </div>
      </div>
    </div>
  );
};

export default CodingStatsCard;
