import { useState } from "react";
import { HiLightBulb } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../services/api";

const AIHintButton = ({ problem, code, difficulty = "easy" }) => {
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const getHint = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ai/hint", { problem, code, difficulty });
      setHint(res.data.data.hint);
      setShowHint(true);
    } catch (error) {
      toast.error("Failed to get hint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={getHint} disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 disabled:opacity-50 transition-colors">
        <HiLightBulb className="w-4 h-4" /> {loading ? "Thinking..." : "Hint"}
      </button>
      {showHint && hint && (
        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
          <p className="font-medium text-yellow-700 dark:text-yellow-400 mb-1">AI Hint:</p>
          {hint}
          <button onClick={() => setShowHint(false)} className="block mt-1 text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default AIHintButton;
