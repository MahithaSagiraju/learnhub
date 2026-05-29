# LearnHub — AI-Powered LMS & Online Coding Platform

A full-stack learning management system with AI-powered tutoring, real-time code execution, interactive quizzes, and certificate generation. Built with React, Node.js, MongoDB, and Gemini AI.

## Features

### 🎓 Course Management
- Browse, search, filter courses by category and level
- Course enrollment with progress tracking
- Video lectures with completion tracking
- Lecture-wise progress per course

### 💻 Coding Challenges
- Built-in code editor (Monaco Editor) with syntax highlighting
- Multi-language support (JavaScript, Python, Java, C++)
- Judge0 API integration for code execution
- Sample + hidden test case evaluation
- Scoring and progress recording

### 📝 Quiz & Assignment System
- Timed quizzes with auto-grading
- Question navigator with attempted/flagged status
- Assignment submission with file upload
- PDF certificate generation (80%+ completion required)

### 🤖 AI-Powered Features
- **AI Doubt Assistant**: 24/7 conversational tutor
- **AI Coding Hints**: Progressive contextual hints for challenges
- **AI Quiz Generator**: Topic-based MCQ generation
- **AI Recommendations**: Personalized learning path suggestions
- **AI Code Debugger**: Analyze and fix code issues

### 📊 Progress Tracking
- Overall course completion percentage
- Quiz score history with charts (Recharts)
- Coding statistics by language and difficulty
- Learning streaks with activity calendar
- Activity timeline

### 🎨 User Experience
- Dark/Light mode with persistence
- Responsive design (mobile + desktop)
- Skeleton loaders and animated page transitions
- Role-based dashboards (Student, Instructor, Admin)

## Tech Stack

### Frontend
- **React 19** + **Vite 8** — Fast development and optimized builds
- **Tailwind CSS v4** — Utility-first styling with dark mode
- **Redux Toolkit** — State management
- **React Router v7** — Client-side routing
- **Framer Motion** — Page transitions and animations
- **Monaco Editor** — Code editor (same as VS Code)
- **Recharts** — Progress charts and data visualization
- **React Hot Toast** — Notification system
- **React Icons** — Icon library

### Backend
- **Node.js** + **Express 5** — REST API server
- **MongoDB** + **Mongoose 9** — Database with relationships
- **JWT** — Access + Refresh token authentication
- **Bcrypt** — Password hashing (12 rounds)
- **Cloudinary** — Media upload and storage
- **Google Gemini AI** — AI-powered features
- **Judge0 CE** — Code execution API
- **PDFKit** — Certificate PDF generation
- **Nodemailer** — Email (password reset)
- **Helmet** + **Rate Limiting** — Security

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Gemini API key (free)
- Cloudinary account (free)
- Judge0 API key (optional, for code execution)

### 1. Clone & Install

```bash
git clone <repo-url>
cd coding-platform

# Server
cd server
cp .env.example .env   # Fill in your env vars
npm install
npm run dev

# Client (in a new terminal)
cd client
cp .env.example .env   # Fill in your env vars
npm install
npm run dev
```

### 2. Environment Variables

#### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secure string for token signing |
| `CLOUDINARY_*` | Cloudinary API credentials |
| `GEMINI_API_KEY` | Google Gemini API key |
| `SMTP_*` | Email credentials (for password reset) |
| `JUDGE0_*` | RapidAPI Judge0 credentials |
| `CLIENT_URL` | Frontend URL for CORS |

#### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |

### 3. Open in Browser
```
http://localhost:5173
```

## Deployment

### Frontend (Vercel)
```bash
cd client
npm install
npm run build
# Deploy the 'dist' directory to Vercel
```

### Backend (Render)
```bash
cd server
npm install
npm start
# Set all env vars in Render dashboard
# Health check: /api/health
```

A `vercel.json` and `render.yaml` are included for easy deployment.

## Project Structure

```
coding-platform/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ai/            # AI assistant components
│   │   │   ├── common/        # Skeleton, EmptyState, AnimatedPage
│   │   │   ├── dashboard/     # Dashboard cards and charts
│   │   │   └── layout/        # Navbar, Footer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # MainLayout
│   │   ├── pages/             # Route pages
│   │   ├── redux/             # Redux store and slices
│   │   ├── routes/            # App routing with code splitting
│   │   └── services/          # API client and services
│   ├── vercel.json            # Vercel deployment config
│   └── vite.config.js
│
├── server/                    # Express backend
│   ├── config/                # DB, Gemini, Cloudinary config
│   ├── controllers/           # Route handlers
│   ├── middlewares/            # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── services/              # Judge0, Gemini, certificate generator
│   ├── utils/                 # ApiResponse, ApiError
│   └── render.yaml            # Render deployment config
│
└── .gitignore
```

## API Overview

| Endpoint | Description | Auth |
|----------|-------------|------|
| `POST /api/auth/register` | Create account | No |
| `POST /api/auth/login` | Login | No |
| `GET /api/courses` | List courses (search/filter) | No |
| `GET /api/challenges` | List coding challenges | No |
| `GET /api/dashboard/student/stats` | Student dashboard | Yes |
| `POST /api/quizzes/submit` | Submit quiz answers | Yes |
| `POST /api/challenges/submit` | Submit coding solution | Yes |
| `POST /api/ai/doubt` | Ask AI tutor | Yes |
| `POST /api/ai/hint` | Get coding hint | Yes |
| `GET /api/progress/stats` | Learning progress stats | Yes |
| `POST /api/certificates/issue` | Issue completion cert | Yes |
| `GET /api/certificates/verify/:id` | Verify certificate | No |

## License

MIT
