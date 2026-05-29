import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { HiPlay, HiCheck, HiX, HiCode, HiTerminal, HiRefresh } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../services/api";
import AIHintButton from "../components/ai/AIHintButton";
import Loader from "../components/common/Loader";

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
};

const DEFAULT_CODE = {
  javascript: "// Write your solution here\n\nfunction solve(input) {\n  // Your code here\n  return input;\n}\n\n// Read input and call solve\nconst readline = require('readline');\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.on('line', (line) => {\n  console.log(solve(line));\n  rl.close();\n});",
  python: "# Write your solution here\n\ndef solve():\n    # Your code here\n    pass\n\nif __name__ == \"__main__\":\n    solve()",
  java: "// Write your solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}",
  cpp: "// Write your solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}",
};

const CodingEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchChallenge();
  }, [id]);

  const fetchChallenge = async () => {
    try {
      const res = await api.get(`/challenges/${id}`);
      setChallenge(res.data.data.challenge);
      const lang = res.data.data.challenge.supportedLanguages?.[0] || "javascript";
      setLanguage(lang);
      const template = res.data.data.challenge.solutionTemplate?.[lang];
      setCode(template || DEFAULT_CODE[lang] || "// Write your code here");
    } catch (error) {
      toast.error("Challenge not found");
      navigate("/challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (challenge?.solutionTemplate?.[newLang]) {
      setCode(challenge.solutionTemplate[newLang]);
    } else {
      setCode(DEFAULT_CODE[newLang] || "// Write your code here");
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("Running...");
    try {
      const res = await api.post("/challenges/run", { code, language, input: "" });
      setOutput(res.data.data.stdout || res.data.data.stderr || "No output");
    } catch (error) {
      setOutput("Error running code");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit");
      navigate("/login");
      return;
    }
    setRunning(true);
    setResults(null);
    try {
      const res = await api.post(`/challenges/${id}/submit`, { code, language });
      setResults(res.data.data);
      setActiveTab("results");
      if (res.data.data.solved) {
        toast.success("All test cases passed! 🎉");
      } else {
        toast.error(`${res.data.data.totalPassed}/${res.data.data.total} tests passed`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <Loader />;
  if (!challenge) return null;

  const difficultyColor = {
    easy: "text-green-500 bg-green-100 dark:bg-green-900/30",
    medium: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
    hard: "text-red-500 bg-red-100 dark:bg-red-900/30",
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-2 flex items-center gap-4">
        <HiCode className="w-5 h-5 text-primary" />
        <h1 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{challenge.title}</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${difficultyColor[challenge.difficulty]}`}>
          {challenge.difficulty}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 dark:border-dark-border rounded text-sm bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary outline-none">
            {challenge.supportedLanguages?.map((lang) => (
              <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
            ))}
          </select>
          <AIHintButton problem={challenge?.problemStatement || challenge?.description} code={code} difficulty={challenge?.difficulty} />
          <button onClick={handleRun} disabled={running}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-dark-border disabled:opacity-50 transition-colors">
            <HiPlay className="w-4 h-4" /> Run
          </button>
          <button onClick={handleSubmit} disabled={running}
            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark disabled:opacity-50 transition-colors">
            <HiCheck className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 border-r border-gray-200 dark:border-dark-border flex flex-col">
          <div className="flex border-b border-gray-200 dark:border-dark-border">
            <button onClick={() => setActiveTab("description")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "description" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
              Description
            </button>
            <button onClick={() => setActiveTab("results")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "results" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}>
              Results
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "description" && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{challenge.problemStatement}</p>
                {challenge.constraints && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Constraints:</h3>
                    <p className="text-sm text-gray-500">{challenge.constraints}</p>
                  </div>
                )}
                {challenge.sampleTestCases?.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sample Test Cases:</h3>
                    {challenge.sampleTestCases.map((tc, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 text-sm">
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Input:</span> <code className="text-primary">{tc.input}</code></p>
                        <p><span className="font-medium text-gray-700 dark:text-gray-300">Output:</span> <code className="text-primary">{tc.expectedOutput}</code></p>
                        {tc.explanation && <p className="text-gray-500 mt-1">{tc.explanation}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "results" && (
              <div className="space-y-4">
                {results ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-lg font-bold ${results.solved ? "text-green-500" : "text-red-500"}`}>
                        {results.solved ? "Accepted" : "Wrong Answer"}
                      </span>
                      <span className="text-sm text-gray-500">{results.totalPassed}/{results.total} test cases passed</span>
                      <span className="text-sm font-medium text-primary">{results.score}%</span>
                    </div>

                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Sample Test Cases:</h4>
                    {results.sampleResults?.map((r, i) => (
                      <div key={i} className={`p-3 rounded-lg text-sm border ${
                        r.passed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {r.passed ? <HiCheck className="w-4 h-4 text-green-500" /> : <HiX className="w-4 h-4 text-red-500" />}
                          <span className="font-medium">Test {i + 1}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">Input: <code>{r.input}</code></p>
                        <p className="text-gray-600 dark:text-gray-400">Expected: <code>{r.expectedOutput}</code></p>
                        <p className="text-gray-600 dark:text-gray-400">Output: <code>{r.actualOutput}</code></p>
                      </div>
                    ))}

                    {results.hiddenResults?.length > 0 && (
                      <>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mt-4">Hidden Test Cases:</h4>
                        {results.hiddenResults.map((r, i) => (
                          <div key={i} className={`p-3 rounded-lg text-sm border ${
                            r.passed ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}>
                            <div className="flex items-center gap-2">
                              {r.passed ? <HiCheck className="w-4 h-4 text-green-500" /> : <HiX className="w-4 h-4 text-red-500" />}
                              <span className="font-medium">Hidden Test {i + 1}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                ) : output ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Output:</h4>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{output}</pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <HiTerminal className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Run or submit your code to see results</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col">
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEditor;
