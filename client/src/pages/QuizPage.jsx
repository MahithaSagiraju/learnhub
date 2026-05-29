import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiClock, HiCheck, HiX, HiArrowRight, HiArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/common/Loader";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quizzes/${id}`);
      const data = res.data.data;
      if (!data.canAttempt) {
        toast.error("No attempts left");
        navigate(-1);
        return;
      }
      setQuiz(data.quiz);
      setTimeLeft(data.quiz.duration * 60);
    } catch (error) {
      toast.error("Quiz not found");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitted]);

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const formattedAnswers = quiz.questions.map((_, i) => answers[i] ?? null);
      const res = await api.post(`/quizzes/${id}/submit`, { answers: formattedAnswers });
      setResults(res.data.data);
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loader text="Loading quiz..." />;
  if (!quiz) return null;

  if (submitted && results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-dark-border text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            results.passed ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
          }`}>
            {results.passed ? <HiCheck className="w-10 h-10 text-green-500" /> : <HiX className="w-10 h-10 text-red-500" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {results.passed ? "Congratulations!" : "Better luck next time"}
          </h2>
          <p className="text-gray-500 mb-6">{results.passed ? "You passed the quiz" : "You did not pass"}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.score}/{results.total}</p>
              <p className="text-xs text-gray-500">Score</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
              <p className={`text-2xl font-bold ${results.passed ? "text-green-500" : "text-red-500"}`}>{results.percentage}%</p>
              <p className="text-xs text-gray-500">Percentage</p>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{results.passingScore}%</p>
              <p className="text-xs text-gray-500">Passing</p>
            </div>
          </div>

          <div className="space-y-3 text-left">
            {results.questions?.map((q, i) => (
              <div key={i} className={`p-4 rounded-lg border ${
                results.answers[i]?.isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{q.question}</p>
                <p className="text-xs text-gray-500">
                  Correct answer: Option {q.correctAnswer + 1}
                </p>
                {q.explanation && <p className="text-xs text-gray-400 mt-1">{q.explanation}</p>}
              </div>
            ))}
          </div>

          <button onClick={() => navigate(-1)}
            className="mt-6 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-colors">
            Back to Course
          </button>
        </motion.div>
      </div>
    );
  }

  const question = quiz.questions?.[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
            <p className="text-sm text-gray-500">{answeredCount}/{quiz.questions?.length} answered</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
            <HiClock className="w-5 h-5" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {quiz.questions?.map((_, i) => (
            <button key={i} onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                currentQuestion === i
                  ? "bg-primary text-white"
                  : answers[i] !== undefined
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-dark-bg text-gray-500"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-border">
            <p className="text-sm text-gray-500 mb-2">Question {currentQuestion + 1} of {quiz.questions?.length}</p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{question?.question}</h2>

            <div className="space-y-3">
              {question?.options?.map((option, i) => (
                <button key={i} onClick={() => handleAnswer(currentQuestion, i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    answers[currentQuestion] === i
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 dark:border-dark-border hover:border-primary/50 text-gray-700 dark:text-gray-300"
                  }`}>
                  <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}
                className="flex items-center gap-1 px-4 py-2 text-gray-500 hover:text-primary disabled:opacity-50 transition-colors">
                <HiArrowLeft className="w-4 h-4" /> Previous
              </button>
              {currentQuestion < quiz.questions?.length - 1 ? (
                <button onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Next <HiArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex items-center gap-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                  <HiCheck className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default QuizPage;
