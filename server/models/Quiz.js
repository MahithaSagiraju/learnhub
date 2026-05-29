import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  options: [
    {
      type: String,
      required: [true, "Options are required"],
    },
  ],
  correctAnswer: {
    type: Number,
    required: [true, "Correct answer index is required"],
    min: 0,
  },
  marks: {
    type: Number,
    default: 1,
    min: [1, "Marks must be at least 1"],
  },
  explanation: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      default: "",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    moduleIndex: {
      type: Number,
      default: 0,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (v) {
          return v.length >= 1;
        },
        message: "At least one question is required",
      },
    },
    duration: {
      type: Number,
      default: 10,
      min: [1, "Duration must be at least 1 minute"],
    },
    passingScore: {
      type: Number,
      default: 40,
      min: [0, "Passing score cannot be negative"],
      max: [100, "Passing score cannot exceed 100"],
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    attemptsAllowed: {
      type: Number,
      default: 1,
      min: [1, "At least 1 attempt allowed"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1, moduleIndex: 1 });

quizSchema.pre("save", function (next) {
  this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  next();
});

export default mongoose.model("Quiz", quizSchema);
