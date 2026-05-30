import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    completedLectures: [
      {
        lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
        completedAt: { type: Date, default: Date.now },
        watchTime: { type: Number, default: 0 },
      },
    ],
    quizResults: [
      {
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
        passed: { type: Boolean, default: false },
        attemptedAt: { type: Date, default: Date.now },
        answers: [
          {
            questionIndex: Number,
            selectedOption: Number,
            isCorrect: Boolean,
          },
        ],
      },
    ],
    codingResults: [
      {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "CodingChallenge" },
        language: { type: String, default: "javascript" },
        code: { type: String, default: "" },
        passedTestCases: { type: Number, default: 0 },
        totalTestCases: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        solved: { type: Boolean, default: false },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });
progressSchema.index({ student: 1 });
progressSchema.index({ course: 1 });
progressSchema.index({ status: 1 });

progressSchema.pre("save", function () {
  if (this.isModified("completedLectures") || this.isModified("quizResults") || this.isModified("codingResults")) {
    this.lastAccessed = new Date();
  }
});

export default mongoose.model("Progress", progressSchema);
