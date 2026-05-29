import { GoogleGenerativeAI } from "@google/generative-ai";

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const askDoubt = async (question, context = "") => {
  try {
    const model = getModel();
    const prompt = `You are an AI coding tutor. Help the student with their doubt.

Context (optional): ${context}
Student's question: ${question}

Provide a clear, helpful explanation with examples if relevant. Keep it concise but thorough.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("AI service unavailable");
  }
};

export const getCodingHint = async (problem, code, difficulty) => {
  try {
    const model = getModel();
    const prompt = `You are an AI coding assistant giving hints (NOT solutions). 

Problem: ${problem}
Current code: ${code || "No code yet"}
Difficulty: ${difficulty}

Give a SINGLE progressive hint that guides the student toward the solution without revealing the full answer.
- For easy: give a small nudge
- For medium: give algorithmic direction
- For hard: give conceptual approach

Respond in 2-3 sentences maximum. Do NOT write the solution code.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("AI service unavailable");
  }
};

export const generateQuiz = async (topic, numQuestions = 5) => {
  try {
    const model = getModel();
    const prompt = `Generate a quiz on the topic "${topic}" with ${numQuestions} multiple choice questions.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "quiz": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Make questions educational and appropriate for the topic.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Quiz generation failed");
  }
};

export const getRecommendation = async (userData) => {
  try {
    const model = getModel();
    const prompt = `You are an AI learning path advisor. Based on the following student data, recommend what they should learn next.

Student data:
${JSON.stringify(userData, null, 2)}

Provide:
1. What to learn next (specific topic/resource)
2. Why it's a good fit based on their progress
3. Estimated difficulty level
4. A suggested resource or approach

Keep response under 150 words. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("Recommendation service unavailable");
  }
};

export const debugCode = async (code, language, error) => {
  try {
    const model = getModel();
    const prompt = `Debug this ${language} code:

Code:
${code}

${error ? `Error: ${error}` : "No specific error message provided."}

Identify the bug(s) and explain how to fix them. Give hints first, then the fix if needed. Keep it concise.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    throw new Error("Debug service unavailable");
  }
};
