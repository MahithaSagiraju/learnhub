import { useState } from "react";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../../services/api";

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.error("Enter a topic");
    setLoading(true);
    setQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);
    try {
      const res = await api.post("/ai/generate-quiz", { topic, numQuestions });
      setQuiz(res.data.data.quiz);
    } catch (error) {
      toast.error("Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qIndex, optIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
      <div className="flex items-center gap-2 mb-4">
        <HiSparkles className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Quiz Generator</h2>
      </div>

      <form onSubmit={generateQuiz} className="flex gap-3 mb-4">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., JavaScript Promises)"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
        <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none">
          {[3, 5, 10].map((n) => <option key={n} value={n}>{n} questions</option>)}
        </select>
        <button type="submit" disabled={loading}
          className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {quiz && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {quiz.map((q, qi) => (
            <div key={qi} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
              <p className="font-medium text-sm text-gray-900 dark:text-white mb-2">{qi + 1}. {q.question}</p>
              <div className="space-y-1">
                {q.options.map((opt, oi) => {
                  const isSelected = selectedAnswers[qi] === oi;
                  const isCorrect = showResults && oi === q.correctAnswer;
                  const isWrong = showResults && isSelected && !isCorrect;
                  return (
                    <button key={oi} onClick={() => handleAnswer(qi, oi)} disabled={showResults}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCorrect
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300"
                          : isWrong
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300"
                            : isSelected
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary/50 text-gray-700 dark:text-gray-300"
                      }`}>
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{q.explanation}</p>
              )}
            </div>
          ))}
          <div className="flex gap-3">
            {!showResults && (
              <button onClick={() => setShowResults(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors">
                Check Answers
              </button>
            )}
            <button onClick={generateQuiz}
              className="border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
              Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIQuizGenerator;
