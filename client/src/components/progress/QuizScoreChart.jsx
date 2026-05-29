import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const QuizScoreChart = ({ quizHistory }) => {
  if (!quizHistory?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No quiz results yet</p>
      </div>
    );
  }

  const data = [...quizHistory].reverse().map((q, i) => ({
    attempt: `#${i + 1}`,
    score: q.percentage,
    passed: q.passed,
    quiz: q.quizTitle,
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Scores Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="attempt" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#fff" }}
            formatter={(value, name) => [value, name === "score" ? "Score (%)" : name]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="score" name="Score (%)" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuizScoreChart;
