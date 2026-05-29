import { GoogleGenerativeAI } from "@google/generative-ai";

const configureGemini = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export default configureGemini;
