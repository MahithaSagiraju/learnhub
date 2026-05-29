import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: [true, "Test case input is required"],
  },
  expectedOutput: {
    type: String,
    required: [true, "Expected output is required"],
  },
  isSample: {
    type: Boolean,
    default: false,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const codingChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Challenge title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    problemStatement: {
      type: String,
      required: [true, "Problem statement is required"],
    },
    constraints: {
      type: String,
      default: "",
    },
    inputFormat: {
      type: String,
      default: "",
    },
    outputFormat: {
      type: String,
      default: "",
    },
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [testCaseSchema],
    supportedLanguages: [
      {
        type: String,
        enum: ["javascript", "python", "java", "cpp", "go", "rust", "typescript"],
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    moduleIndex: {
      type: Number,
      default: 0,
    },
    solutionTemplate: {
      javascript: { type: String, default: "" },
      python: { type: String, default: "" },
      java: { type: String, default: "" },
      cpp: { type: String, default: "" },
    },
    solution: {
      type: String,
      default: "",
    },
    timeLimit: {
      type: Number,
      default: 2000,
      min: [100, "Time limit must be at least 100ms"],
    },
    memoryLimit: {
      type: Number,
      default: 256,
      min: [16, "Memory limit must be at least 16MB"],
    },
    tags: [{ type: String, trim: true }],
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    totalAccepted: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

codingChallengeSchema.index({ course: 1, moduleIndex: 1 });
codingChallengeSchema.index({ difficulty: 1 });
codingChallengeSchema.index({ tags: 1 });

codingChallengeSchema.virtual("acceptanceRate").get(function () {
  if (this.totalSubmissions === 0) return 0;
  return Math.round((this.totalAccepted / this.totalSubmissions) * 100);
});

export default mongoose.model("CodingChallenge", codingChallengeSchema);
