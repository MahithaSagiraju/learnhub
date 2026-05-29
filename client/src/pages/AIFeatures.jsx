import { motion } from "framer-motion";
import AIQuizGenerator from "../components/ai/AIQuizGenerator";
import AIRecommendation from "../components/ai/AIRecommendation";

const AIFeatures = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI-Powered Tools</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Leverage AI to enhance your learning experience</p>

        <div className="space-y-6">
          <AIQuizGenerator />
          <AIRecommendation />
        </div>
      </motion.div>
    </div>
  );
};

export default AIFeatures;
