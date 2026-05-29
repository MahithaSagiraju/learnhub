import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiSparkles, HiRefresh } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../services/api";

const AIRecommendation = () => {
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const fetchRecommendation = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/recommendation");
      setRecommendation(res.data.data.recommendation);
      setLoaded(true);
    } catch (error) {
      if (!loaded) setRecommendation("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiSparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Learning Path</h2>
        </div>
        <button onClick={fetchRecommendation} disabled={loading}
          className="text-gray-400 hover:text-primary transition-colors">
          <HiRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-2/3" />
        </div>
      ) : recommendation ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: recommendation.replace(/\n/g, "<br/>") }} />
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete some courses to get personalized recommendations.</p>
      )}
    </div>
  );
};

export default AIRecommendation;
