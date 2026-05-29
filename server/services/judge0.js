import axios from "axios";

const JUDGE0_URL = process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY;

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  typescript: 74,
  go: 60,
  rust: 73,
};

export const executeCode = async (sourceCode, language, stdin = "") => {
  try {
    const languageId = LANGUAGE_IDS[language];
    if (!languageId) throw new Error(`Unsupported language: ${language}`);

    const submissionRes = await axios.post(
      `${JUDGE0_URL}/submissions`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        expected_output: null,
        cpu_time_limit: 2,
        memory_limit: 256000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(JUDGE0_KEY && { "X-RapidAPI-Key": JUDGE0_KEY }),
          ...(JUDGE0_KEY && { "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com" }),
        },
      }
    );

    const { token } = submissionRes.data;

    // Poll for result
    let result;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const resultRes = await axios.get(`${JUDGE0_URL}/submissions/${token}`, {
        headers: {
          "Content-Type": "application/json",
          ...(JUDGE0_KEY && { "X-RapidAPI-Key": JUDGE0_KEY }),
          ...(JUDGE0_KEY && { "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com" }),
        },
        params: { base64_encoded: false, fields: "*" },
      });
      result = resultRes.data;
      if (result.status?.id >= 3) break;
    }

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status?.description || "Unknown",
      time: result.time,
      memory: result.memory,
      exitCode: result.exit_code,
      passed: result.status?.id === 3,
    };
  } catch (error) {
    if (error.response?.status === 429) {
      return { stdout: "", stderr: "Rate limited. Please try again.", status: "Rate Limited", passed: false };
    }
    return { stdout: "", stderr: error.message, status: "Error", passed: false };
  }
};

export const runTests = async (sourceCode, language, testCases) => {
  const results = [];
  let passed = 0;

  for (const testCase of testCases) {
    const result = await executeCode(sourceCode, language, testCase.input);

    const output = (result.stdout || "").trim();
    const expected = (testCase.expectedOutput || "").trim();
    const testPassed = output === expected;

    results.push({
      input: testCase.input,
      expectedOutput: expected,
      actualOutput: output,
      passed: testPassed,
      status: result.status,
      isSample: testCase.isSample,
      explanation: testCase.explanation,
    });

    if (testPassed) passed++;
  }

  return { results, passed, total: testCases.length };
};
