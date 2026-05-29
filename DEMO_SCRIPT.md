# LearnHub — Demo Walkthrough Script

## Setup
1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Open `http://localhost:5173`

---

## 1. Landing Page & Guest Browsing
**Goal**: Show the public-facing experience.

1. Open the app — see hero section with gradient title "Learn, Code, Grow with AI-Powered Learning"
2. Scroll to features: Expert Courses, Coding Challenges, Track Progress, AI Assistant
3. Click **Courses** in navbar — explore the course grid
4. Use search bar, filter by category (dropdown) and level (Beginner/Intermediate/Advanced)
5. Click a course card — see course detail page with description, instructor, curriculum (lecture list)
6. **Click**: "Login" → "Get Started" to show auth options

---

## 2. Authentication
**Goal**: Demonstrate registration and login flow.

1. Click **Get Started** — see registration form with name, email, password, role (Student)
2. Fill in and submit — redirected to dashboard
3. **Alternative**: Click **Login** — existing user can log in
4. After login — navbar shows user name, Logout button, and role-specific links
5. ✅ Test "Forgot Password" link — enters email, sends reset link (console logs email in dev)

---

## 3. Student Dashboard
**Goal**: Show the personalized learning overview.

1. After login, land on **Dashboard** or click **Dashboard** in navbar
2. See stat cards: Enrolled Courses, Challenges Solved, Avg Quiz Score, Certificates
3. **Learning Activity** chart (Recharts bar chart — Lectures, Quizzes, Coding per month)
4. **Recent Activity** feed (timeline of last actions)
5. **Continue Learning** section — enrolled courses with progress bars
6. **Recommended For You** — suggested courses with AI recommendation widget
7. Toggle dark mode (moon/sun icon in navbar) — theme persists on reload

---

## 4. Course Enrollment & Learning
**Goal**: Take a course from enrollment to completion.

1. Navigate to **Courses** → click a course
2. Click **Enroll Now** (or "Continue Learning" if already enrolled)
3. Course detail page shows: thumbnail, description, instructor, curriculum
4. Click a lecture — video player, lecture content, **Mark Complete** button
5. Progress bar updates as lectures are completed
6. ✅ Quiz link shows when available in the course module

---

## 5. Coding Challenges
**Goal**: Demonstrate the integrated code editor and Judge0 execution.

1. Click **Challenges** in navbar (or `/challenges`)
2. Filter by difficulty (Easy/Medium/Hard)
3. Click a challenge — opens full-screen **Monaco Editor**
4. Left panel: problem statement, examples, constraints
5. Select language (JavaScript, Python, Java, C++)
6. Write code in the editor
7. Click **Run** — code executes, output appears in bottom panel
8. Click **Submit** — runs against test cases, shows pass/fail per case, score
9. **AI Hint** button — click to get progressive contextual hints from Gemini AI

---

## 6. Quiz & Assignments
**Goal**: Show the quiz timer, navigation, and auto-grading.

1. Navigate to a course with a quiz → click quiz link
2. Quiz page: timer countdown, question navigator (answered/flagged/unanswered)
3. Select answers for MCQs
4. Click **Submit Quiz** — auto-graded, shows result with score, pass/fail, explanations
5. **Assignment** page: view instructions, upload submission file
6. After grading — see instructor feedback and score

---

## 7. AI Features
**Goal**: Showcase all five AI capabilities.

1. Click **AI Tools** in navbar (`/ai`)
2. **AI Quiz Generator**: Enter a topic → generates 5 MCQs with explanations
3. **AI Recommendation**: Shows personalized learning path
4. **AI Doubt Assistant** (floating chat button, bottom-right):
   - Click to open chat bubble
   - Type a question → gets AI-powered response with code blocks
5. On coding challenge page: **AI Hint** button gives step-by-step hints
6. **AI Code Debug** (via doubt assistant): paste code, ask "debug this"

---

## 8. Progress Tracking
**Goal**: Show comprehensive learning analytics.

1. Click **Progress** in navbar (`/progress`)
2. **Progress Overview**: Course completion %, Avg Quiz Score, Challenges Solved, Day Streak
3. **Quiz Scores Over Time** — line chart of quiz performance
4. **Coding Statistics** — breakdown by difficulty (Easy/Medium/Hard) and language
5. **Learning Streak** — activity heatmap (50-day grid), current/longest streak
6. **Learning History** — timeline of all activities (lectures, quizzes, coding)

---

## 9. Certificates
**Goal**: Generate and verify PDF certificates.

1. Complete 80%+ of a course → **Certificates** page shows earned certs
2. **Download PDF** button — downloads a styled PDF certificate
3. Grade and score calculated from quiz average and completion rate
4. **Public Verification**: Go to `/verify-certificate`
5. Enter certificate ID (from the PDF) → shows validation result

---

## 10. Instructor Dashboard
**Goal**: Show instructor course management.

1. Login as instructor → **Instructor** link in navbar
2. Dashboard: total courses, total students, revenue, monthly chart
3. **Create Course** button → form: title, description, category, level, price, thumbnail upload
4. Course management page: add/edit/delete lectures, reorder, publish/unpublish
5. Student enrollment list per course

---

## 11. Admin Dashboard
**Goal**: Show admin user management.

1. Login as admin → **Admin** link in navbar
2. User management table: list all users, filter by role
3. Change user roles (student/instructor/admin)
4. Delete users

---

## 12. Dark Mode & Responsiveness
**Goal**: Show UI polish.

1. **Dark mode toggle** — navbar moon/sun icon, persists in localStorage
2. Resize browser to mobile width — hamburger menu, stacked layouts
3. Animations — page transitions (fade-in), card hover effects, loading skeletons
