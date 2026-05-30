import mongoose from "mongoose";

const activityItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["lecture", "quiz", "coding", "login", "assignment"],
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "activities.referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["Lecture", "Quiz", "CodingChallenge", "Assignment"],
    },
    details: { type: String, default: "" },
    points: { type: Number, default: 0 },
  },
  { _id: false }
);

const learningActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activities: [activityItemSchema],
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

learningActivitySchema.index({ user: 1, date: 1 }, { unique: true });
learningActivitySchema.index({ user: 1 });
learningActivitySchema.index({ date: -1 });

learningActivitySchema.pre("save", function () {
  this.totalPoints = this.activities.reduce((sum, a) => sum + (a.points || 0), 0);
});

export default mongoose.model("LearningActivity", learningActivitySchema);
