import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
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
    dueDate: {
      type: Date,
    },
    totalMarks: {
      type: Number,
      required: [true, "Total marks is required"],
      min: [1, "Total marks must be at least 1"],
    },
    passingMarks: {
      type: Number,
      default: 0,
    },
    attachments: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ["pdf", "link", "file", "code"] },
      },
    ],
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileUrl: { type: String, default: "" },
        text: { type: String, default: "" },
        submittedAt: { type: Date, default: Date.now },
        marksObtained: { type: Number, default: null },
        feedback: { type: String, default: "" },
        status: {
          type: String,
          enum: ["submitted", "graded", "late"],
          default: "submitted",
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

assignmentSchema.index({ course: 1, moduleIndex: 1 });
assignmentSchema.index({ "submissions.student": 1 });

export default mongoose.model("Assignment", assignmentSchema);
