import { useState, useEffect } from "react";
import api from "../services/api";
import ProgressOverview from "../components/progress/ProgressOverview";
import QuizScoreChart from "../components/progress/QuizScoreChart";
import CodingStatsCard from "../components/progress/CodingStatsCard";
import StreakTracker from "../components/progress/StreakTracker";
import LearningHistory from "../components/progress/LearningHistory";
import AnimatedPage from "../components/common/AnimatedPage";
import { SkeletonStats } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const ProgressPage = () => {
  const [stats, setStats] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [codingStats, setCodingStats] = useState(null);
  const [streak, setStreak] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, quizRes, codingRes, streakRes, timelineRes] = await Promise.all([
          api.get("/api/progress/stats"),
          api.get("/api/progress/quiz-history"),
          api.get("/api/progress/coding-stats"),
          api.get("/api/progress/streak"),
          api.get("/api/progress/activity-timeline"),
        ]);
        setStats(statsRes.data.data);
        setQuizHistory(quizRes.data.data.quizHistory || []);
        setCodingStats(codingRes.data.data);
        setStreak(streakRes.data.data);
        setTimeline(timelineRes.data.data.timeline || []);
      } catch (error) {
        console.error("Failed to load progress data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <SkeletonStats />
    </div>
  );

  return (
    <AnimatedPage>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Progress</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your learning journey</p>
          </div>
          {stats && (
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Points</p>
              <p className="text-2xl font-bold text-primary dark:text-primary-light">{stats.todayPoints}</p>
            </div>
          )}
        </div>

        <ProgressOverview stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <QuizScoreChart quizHistory={quizHistory} />
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <CodingStatsCard stats={codingStats} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <StreakTracker streak={streak} />
          </div>
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
            <LearningHistory timeline={timeline} />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ProgressPage;
