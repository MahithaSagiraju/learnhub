import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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
    certificateId: {
      type: String,
      unique: true,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F", "Pass"],
      default: "Pass",
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    downloadUrl: {
      type: String,
      default: "",
    },
    metadata: {
      courseTitle: String,
      studentName: String,
      instructorName: String,
      duration: String,
    },
  },
  { timestamps: true }
);

certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ student: 1, course: 1 }, { unique: true });

certificateSchema.pre("save", function (next) {
  if (!this.certificateId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateId = `CERT-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model("Certificate", certificateSchema);
