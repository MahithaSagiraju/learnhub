import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCode, HiCheck, HiX } from "react-icons/hi";
import api from "../services/api";
import Loader from "../components/common/Loader";

const difficultyColors = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const CodingChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetchChallenges();
  }, [difficulty]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params = {};
      if (difficulty) params.difficulty = difficulty;
      const res = await api.get("/challenges", { params });
      setChallenges(res.data.data.challenges);
    } catch (error) {
      console.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coding Challenges</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Solve problems and improve your skills</p>
          </div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">All</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {loading ? <Loader /> : (
          <div className="space-y-2">
            {challenges.map((challenge, i) => (
              <motion.div
                key={challenge._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/challenges/${challenge._id}`}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border hover:shadow-md hover:border-primary/50 transition-all group"
                >
                  <HiCode className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{challenge.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={difficultyColors[challenge.difficulty] || ""}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-gray-500">{challenge.acceptanceRate || 0}%</span>
                    <span className="text-gray-400">{challenge.totalSubmissions || 0}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {challenges.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                <HiCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No challenges found</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CodingChallengeList;
