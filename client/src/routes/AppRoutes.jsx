import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Loader from "../components/common/Loader";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Courses from "../pages/Courses";
import NotFound from "../pages/NotFound";

const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CourseDetail = lazy(() => import("../pages/CourseDetail"));
const CodingChallengeList = lazy(() => import("../pages/CodingChallengeList"));
const CodingEditor = lazy(() => import("../pages/CodingEditor"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const AssignmentPage = lazy(() => import("../pages/AssignmentPage"));
const AIFeatures = lazy(() => import("../pages/AIFeatures"));
const ProgressPage = lazy(() => import("../pages/ProgressPage"));
const Certificates = lazy(() => import("../pages/Certificates"));
const VerifyCertificate = lazy(() => import("../pages/VerifyCertificate"));
const InstructorDashboard = lazy(() => import("../pages/InstructorDashboard"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const CreateCourse = lazy(() => import("../pages/CreateCourse"));
const ManageCourse = lazy(() => import("../pages/ManageCourse"));

const LazyFallback = () => <Loader text="Loading..." />;
const LazyRoute = ({ children }) => <Suspense fallback={<LazyFallback />}>{children}</Suspense>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<LazyRoute><ForgotPassword /></LazyRoute>} />
        <Route path="/reset-password/:token" element={<LazyRoute><ResetPassword /></LazyRoute>} />

        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<LazyRoute><CourseDetail /></LazyRoute>} />

        <Route path="/challenges" element={<LazyRoute><CodingChallengeList /></LazyRoute>} />

        <Route path="/quiz/:id" element={<ProtectedRoute><LazyRoute><QuizPage /></LazyRoute></ProtectedRoute>} />
        <Route path="/assignment/:id" element={<ProtectedRoute><LazyRoute><AssignmentPage /></LazyRoute></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><LazyRoute><AIFeatures /></LazyRoute></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><LazyRoute><ProgressPage /></LazyRoute></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><LazyRoute><Certificates /></LazyRoute></ProtectedRoute>} />
        <Route path="/verify-certificate" element={<LazyRoute><VerifyCertificate /></LazyRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><LazyRoute><Dashboard /></LazyRoute></ProtectedRoute>} />

        <Route path="/instructor/dashboard" element={<ProtectedRoute roles={["instructor", "admin"]}><LazyRoute><InstructorDashboard /></LazyRoute></ProtectedRoute>} />
        <Route path="/instructor/courses/create" element={<ProtectedRoute roles={["instructor", "admin"]}><LazyRoute><CreateCourse /></LazyRoute></ProtectedRoute>} />
        <Route path="/instructor/courses/:id" element={<ProtectedRoute roles={["instructor", "admin"]}><LazyRoute><ManageCourse /></LazyRoute></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><LazyRoute><AdminDashboard /></LazyRoute></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/challenges/:id" element={<LazyRoute><CodingEditor /></LazyRoute>} />
    </Routes>
  );
};

export default AppRoutes;
