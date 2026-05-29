import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [120, "Title must be at most 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      minlength: [20, "Description must be at least 20 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Cloud Computing",
        "Cybersecurity",
        "Programming Languages",
        "Database",
        "AI",
        "Other",
      ],
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    modules: [
      {
        title: { type: String, required: true },
        description: String,
        order: { type: Number, default: 0 },
        lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
      },
    ],
    resources: [
      {
        title: String,
        url: String,
        type: { type: String, enum: ["pdf", "link", "file"] },
      },
    ],
    studentsEnrolled: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        enrolledAt: { type: Date, default: Date.now },
      },
    ],
    totalDuration: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ price: 1, level: 1 });

courseSchema.virtual("lectureCount").get(function () {
  return this.modules.reduce((sum, mod) => sum + (mod.lectures?.length || 0), 0);
});

courseSchema.pre("save", function (next) {
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  next();
});

export default mongoose.model("Course", courseSchema);
