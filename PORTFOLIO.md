# LearnHub — Portfolio / Resume Assets

## Project Summary
> A full-stack AI-powered Learning Management System and Online Coding Platform built with React, Node.js, MongoDB, and Google Gemini AI. Features an integrated code editor (Monaco), real-time code execution (Judge0 API), AI tutoring, and automated certificate generation.

## Resume Bullet Points

### Backend (Node.js + Express + MongoDB)
- Built RESTful API with Express 5, Mongoose ODM, and JWT authentication (access + refresh tokens)
- Designed MongoDB schema with 9 models, compound indexes, and pre-save hooks for auto-generated slugs and certificate IDs
- Implemented role-based access control (Student, Instructor, Admin) with custom middleware
- Integrated Judge0 CE API for multi-language code execution (JS, Python, Java, C++) with test case scoring
- Engineered AI service layer with 5 Gemini prompt templates for doubt solving, coding hints, quiz generation, recommendations, and code debugging
- Developed PDF certificate generation service using PDFKit with auto-issuance on course completion
- Built a daily activity tracking system for learning streaks and progress analytics

### Frontend (React + Vite + Tailwind CSS)
- Architected SPA with React 19, Vite 8, Redux Toolkit, and React Router v7 with lazy-loaded code splitting (24 chunks, 494 KB main bundle)
- Built Monaco Editor integration for multi-language coding challenges with syntax highlighting and theme sync
- Implemented Recharts-based dashboards (bar charts, line charts) for learning activity and quiz score visualization
- Created AI-powered UI components: floating doubt assistant chat bubble, progressive hint button, quiz generator, and recommendation widget
- Designed responsive dark/light theme system with Tailwind CSS v4, localStorage persistence, and smooth Framer Motion transitions
- Developed skeleton loaders, empty states, error states, and animated page transitions for polished UX

### Key Features Delivered
- Authentication system: register, login, logout, forgot/reset password, refresh tokens
- Course management: CRUD, enrollment, lecture tracking, progress percentage
- Coding challenge system: Monaco editor, Judge0 execution, test case scoring
- Quiz system: timed MCQs, auto-grading, explanations, attempt limits
- Assignment system: submissions, file uploads, instructor grading
- AI features: doubt assistant, coding hints, quiz generator, recommendations, code debugger
- Progress tracking: overall stats, quiz history, coding stats, streaks, activity timeline
- Certificate generation: PDF download, public verification by ID
- Deployment-ready: Vercel config (SPA rewrites), Render config (blueprint with env vars)

## Tech Keywords
React 19, Vite 8, Tailwind CSS v4, Redux Toolkit, Node.js, Express 5, MongoDB, Mongoose, JWT, Bcrypt, Cloudinary, Google Gemini AI, Judge0 CE, Monaco Editor, Recharts, Framer Motion, PDFKit, Nodemailer, Helmet, Vercel, Render

## LinkedIn Headline
> Full-Stack Developer | React, Node.js, MongoDB, AI Integration

## Project Links
- GitHub: [repo-url]
- Live Demo: [vercel-url]
- API Base: [render-url] (if deployed)
