import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Lecture from "./models/Lecture.js";

dotenv.config();

const courses = [
  {
    title: "JavaScript Fundamentals",
    description: "Master JavaScript from scratch. Covers variables, functions, objects, arrays, closures, promises, and modern ES6+ features with hands-on projects.",
    category: "Programming Languages",
    level: "beginner",
    price: 0,
    tags: ["javascript", "web", "frontend"],
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    modules: [
      {
        title: "Getting Started with JavaScript",
        description: "Learn the basics of JavaScript programming",
        order: 0,
        lectures: [
          { title: "Introduction to JavaScript", description: "What is JavaScript and how it works", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk", duration: 600, order: 0, isPreview: true },
          { title: "Variables and Data Types", description: "Understanding let, const, var, strings, numbers, booleans", videoUrl: "https://www.youtube.com/embed/9M4XKi25I2M", duration: 900, order: 1 },
          { title: "Functions and Scope", description: "Function declarations, expressions, arrow functions, and scope", videoUrl: "https://www.youtube.com/embed/NU-Z8RqX1lE", duration: 1200, order: 2 },
        ],
      },
      {
        title: "Advanced Concepts",
        description: "Dive deeper into JavaScript",
        order: 1,
        lectures: [
          { title: "Arrays and Objects", description: "Working with collections and key-value pairs", videoUrl: "https://www.youtube.com/embed/oigfaKJ0RkE", duration: 900, order: 0 },
          { title: "Promises and Async/Await", description: "Understanding asynchronous JavaScript", videoUrl: "https://www.youtube.com/embed/DHvZLI7Db8E", duration: 1500, order: 1 },
          { title: "Closures and the Event Loop", description: "Advanced JavaScript concepts explained", videoUrl: "https://www.youtube.com/embed/vK2pn1T4w70", duration: 1200, order: 2 },
        ],
      },
    ],
  },
  {
    title: "Python for Data Science",
    description: "Learn Python programming with a focus on data science. Covers NumPy, Pandas, Matplotlib, and real-world data analysis projects.",
    category: "Data Science",
    level: "beginner",
    price: 0,
    tags: ["python", "data-science", "analytics"],
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    modules: [
      {
        title: "Python Basics",
        description: "Get started with Python",
        order: 0,
        lectures: [
          { title: "Python Setup and Introduction", description: "Installing Python and writing your first program", videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc", duration: 600, order: 0, isPreview: true },
          { title: "Data Types and Control Flow", description: "Lists, tuples, dicts, if/else, loops", videoUrl: "https://www.youtube.com/embed/LHBE6Q9XlzI", duration: 1200, order: 1 },
          { title: "Functions and Modules", description: "Creating reusable code with functions", videoUrl: "https://www.youtube.com/embed/N4mEzFDjqtA", duration: 900, order: 2 },
        ],
      },
      {
        title: "Data Science Libraries",
        description: "Essential Python libraries",
        order: 1,
        lectures: [
          { title: "NumPy Fundamentals", description: "Numerical computing with NumPy arrays", videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI", duration: 1500, order: 0 },
          { title: "Pandas for Data Analysis", description: "Data manipulation with DataFrames", videoUrl: "https://www.youtube.com/embed/vmEHCJofslg", duration: 1800, order: 1 },
          { title: "Data Visualization with Matplotlib", description: "Creating charts and plots", videoUrl: "https://www.youtube.com/embed/UO98lJQ3QGI", duration: 1200, order: 2 },
        ],
      },
    ],
  },
  {
    title: "React - The Complete Guide",
    description: "Build modern single-page applications with React. Covers components, hooks, state management, routing, and deployment.",
    category: "Web Development",
    level: "intermediate",
    price: 0,
    tags: ["react", "frontend", "javascript"],
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    modules: [
      {
        title: "React Fundamentals",
        description: "Core React concepts",
        order: 0,
        lectures: [
          { title: "What is React?", description: "Understanding React's component model", videoUrl: "https://www.youtube.com/embed/Tn6-PIqc4UM", duration: 600, order: 0, isPreview: true },
          { title: "JSX and Components", description: "Writing JSX and creating components", videoUrl: "https://www.youtube.com/embed/DLX62G4sB8M", duration: 1200, order: 1 },
          { title: "State and Props", description: "Managing component state and passing data", videoUrl: "https://www.youtube.com/embed/4ORZ1GmjaMc", duration: 1500, order: 2 },
        ],
      },
      {
        title: "Hooks and Advanced Patterns",
        description: "Modern React with hooks",
        order: 1,
        lectures: [
          { title: "useState and useEffect", description: "The most important React hooks", videoUrl: "https://www.youtube.com/embed/O6P86uwfdR0", duration: 1200, order: 0 },
          { title: "Custom Hooks", description: "Building reusable hooks", videoUrl: "https://www.youtube.com/embed/6ThXsUwLWvc", duration: 900, order: 1 },
          { title: "React Router", description: "Client-side routing in React apps", videoUrl: "https://www.youtube.com/embed/Ul3y1LXx3QY", duration: 1200, order: 2 },
        ],
      },
      {
        title: "State Management",
        description: "Managing complex state",
        order: 2,
        lectures: [
          { title: "Context API", description: "Global state with React Context", videoUrl: "https://www.youtube.com/embed/5LrDIWkK_Bc", duration: 900, order: 0 },
          { title: "Redux Toolkit", description: "Predictable state management", videoUrl: "https://www.youtube.com/embed/bbkBuqC1rU4", duration: 1800, order: 1 },
        ],
      },
    ],
  },
  {
    title: "Node.js Backend Development",
    description: "Build scalable backend APIs with Node.js, Express, and MongoDB. Covers REST APIs, authentication, file uploads, and deployment.",
    category: "Web Development",
    level: "intermediate",
    price: 0,
    tags: ["nodejs", "backend", "express", "api"],
    thumbnail: "https://images.unsplash.com/photo-1624953587687-daf255b6b8a3?w=800",
    modules: [
      {
        title: "Getting Started with Node.js",
        description: "Node.js basics",
        order: 0,
        lectures: [
          { title: "Node.js Introduction", description: "What is Node.js and the runtime environment", videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4", duration: 600, order: 0, isPreview: true },
          { title: "Modules and NPM", description: "Using built-in modules and package management", videoUrl: "https://www.youtube.com/embed/2VkUfq1oV1w", duration: 900, order: 1 },
          { title: "File System and Streams", description: "Working with files and streams", videoUrl: "https://www.youtube.com/embed/UhY6g_7R81w", duration: 1200, order: 2 },
        ],
      },
      {
        title: "Express and APIs",
        description: "Building web servers",
        order: 1,
        lectures: [
          { title: "Express.js Framework", description: "Setting up Express and routing", videoUrl: "https://www.youtube.com/embed/Lr9WUkeYSA8", duration: 1200, order: 0 },
          { title: "RESTful API Design", description: "Designing clean REST APIs", videoUrl: "https://www.youtube.com/embed/FGd4VIN7l6Y", duration: 1500, order: 1 },
          { title: "MongoDB with Mongoose", description: "Database integration", videoUrl: "https://www.youtube.com/embed/DRbDPS7Z7f4", duration: 1800, order: 2 },
        ],
      },
    ],
  },
  {
    title: "SQL & Database Design",
    description: "Learn relational database design and SQL. Covers queries, joins, indexes, normalization, and database modeling.",
    category: "Database",
    level: "beginner",
    price: 0,
    tags: ["sql", "database", "postgresql", "mysql"],
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    modules: [
      {
        title: "SQL Fundamentals",
        description: "Core SQL concepts",
        order: 0,
        lectures: [
          { title: "Introduction to Databases", description: "Relational vs NoSQL databases", videoUrl: "https://www.youtube.com/embed/ALm4F1GEShI", duration: 600, order: 0, isPreview: true },
          { title: "SELECT Queries", description: "Querying data with SELECT", videoUrl: "https://www.youtube.com/embed/Hpih7dAxCkM", duration: 900, order: 1 },
          { title: "JOINs and Subqueries", description: "Combining data from multiple tables", videoUrl: "https://www.youtube.com/embed/9yeOJ0ZMUYw", duration: 1200, order: 2 },
        ],
      },
      {
        title: "Advanced Database Design",
        description: "Designing efficient databases",
        order: 1,
        lectures: [
          { title: "Normalization", description: "Database normalization forms", videoUrl: "https://www.youtube.com/embed/GFQa3T_v4Dk", duration: 1500, order: 0 },
          { title: "Indexes and Performance", description: "Optimizing query performance", videoUrl: "https://www.youtube.com/embed/Nu8LhEKPnpE", duration: 900, order: 1 },
          { title: "Transactions and ACID", description: "Understanding database transactions", videoUrl: "https://www.youtube.com/embed/4Z9KEBexzcM", duration: 1200, order: 2 },
        ],
      },
    ],
  },
  {
    title: "Machine Learning with Python",
    description: "Dive into machine learning using scikit-learn and TensorFlow. Covers supervised and unsupervised learning, neural networks, and model deployment.",
    category: "Machine Learning",
    level: "advanced",
    price: 0,
    tags: ["machine-learning", "python", "ai", "tensorflow"],
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    modules: [
      {
        title: "ML Fundamentals",
        description: "Core ML concepts",
        order: 0,
        lectures: [
          { title: "What is Machine Learning?", description: "Types of ML and real-world applications", videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", duration: 900, order: 0, isPreview: true },
          { title: "Data Preprocessing", description: "Cleaning and preparing data", videoUrl: "https://www.youtube.com/embed/87kQ2oJy51E", duration: 1200, order: 1 },
          { title: "Linear Regression", description: "Predicting continuous values", videoUrl: "https://www.youtube.com/embed/CtsRRUddV2o", duration: 1500, order: 2 },
        ],
      },
      {
        title: "Supervised Learning",
        description: "Learning with labeled data",
        order: 1,
        lectures: [
          { title: "Decision Trees and Random Forests", description: "Tree-based learning algorithms", videoUrl: "https://www.youtube.com/embed/7VeUPuFGJHk", duration: 1500, order: 0 },
          { title: "Support Vector Machines", description: "Classification with SVMs", videoUrl: "https://www.youtube.com/embed/FB5EdxAGxQg", duration: 1200, order: 1 },
          { title: "Neural Networks Basics", description: "Introduction to deep learning", videoUrl: "https://www.youtube.com/embed/aircAruvnKk", duration: 1800, order: 2 },
        ],
      },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let instructor = await User.findOne({ email: "instructor@learnhub.com" });
    if (!instructor) {
      instructor = await User.create({
        name: "Sarah Johnson",
        email: "instructor@learnhub.com",
        password: "password123",
        role: "instructor",
        bio: "Senior software engineer with 10+ years of experience teaching web development and data science.",
      });
      console.log("Created instructor: Sarah Johnson");
    } else {
      console.log("Instructor already exists");
    }

    let admin = await User.findOne({ email: "admin@learnhub.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin User",
        email: "admin@learnhub.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Created admin user");
    }

    let created = 0;
    for (const courseData of courses) {
      const existing = await Course.findOne({ title: courseData.title });
      if (existing) {
        console.log(`Skipping "${courseData.title}" — already exists`);
        continue;
      }

      const { modules, ...courseFields } = courseData;
      const course = await Course.create({
        ...courseFields,
        instructor: instructor._id,
        status: "published",
        totalDuration: modules.reduce((sum, m) =>
          sum + m.lectures.reduce((s, l) => s + (l.duration || 0), 0), 0
        ),
      });

      const moduleIds = [];
      for (let mi = 0; mi < modules.length; mi++) {
        const mod = modules[mi];
        const lectureIds = [];
        for (const lec of mod.lectures) {
          const lecture = await Lecture.create({
            ...lec,
            course: course._id,
            moduleIndex: mi,
          });
          lectureIds.push(lecture._id);
        }
        moduleIds.push({ title: mod.title, description: mod.description, order: mod.order, lectures: lectureIds });
      }

      course.modules = moduleIds;
      await course.save({ validateBeforeSave: false });
      created++;
      console.log(`Created course: "${course.title}" with ${moduleIds.reduce((s, m) => s + m.lectures.length, 0)} lectures`);
    }

    console.log(`\nDone! ${created} new courses created.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
