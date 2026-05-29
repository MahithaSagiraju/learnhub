import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiPlay, HiCheck, HiLockClosed, HiStar, HiUser, HiClock, HiBookOpen } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/common/Loader";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setData(res.data.data);
      if (res.data.data.lectures?.length > 0) {
        setSelectedLecture(res.data.data.lectures[0]);
      }
    } catch (error) {
      toast.error("Course not found");
      navigate("/courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      toast.success("Enrolled successfully!");
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleLectureComplete = async (lectureId) => {
    try {
      const res = await api.post(`/courses/${id}/complete-lecture`, { lectureId });
      setData((prev) => ({ ...prev, progress: res.data.data.progress }));
      toast.success("Lecture completed!");
    } catch (error) {
      toast.error("Failed to mark lecture");
    }
  };

  if (loading) return <Loader />;
  if (!data) return null;

  const { course, lectures, progress, isEnrolled } = data;
  const completedLectureIds = progress?.completedLectures?.map((l) => l.lecture?.toString() || l.lecture) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {selectedLecture && (
              <div className="bg-black rounded-xl overflow-hidden aspect-video">
                {selectedLecture.videoUrl?.includes("youtube") || selectedLecture.videoUrl?.includes("youtu.be") ? (
                  <iframe
                    src={selectedLecture.videoUrl.replace("watch?v=", "embed/")}
                    title={selectedLecture.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full"
                    controlsList="nodownload"
                  >
                    Your browser does not support video.
                  </video>
                )}
              </div>
            )}

            {selectedLecture && (
              <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedLecture.title}</h2>
                <p className="text-gray-500 dark:text-gray-400">{selectedLecture.description}</p>
                {isEnrolled && (
                  <button
                    onClick={() => handleLectureComplete(selectedLecture._id)}
                    disabled={completedLectureIds.includes(selectedLecture._id)}
                    className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      completedLectureIds.includes(selectedLecture._id)
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                  >
                    <HiCheck className="w-4 h-4" />
                    {completedLectureIds.includes(selectedLecture._id) ? "Completed" : "Mark as Complete"}
                  </button>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Description</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{course.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
              <div className="h-40 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <HiBookOpen className="w-16 h-16 text-white/50" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{course.category}</span>
                <span className="text-xs px-2 py-0.5 bg-purple/10 text-accent rounded-full capitalize">{course.level}</span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-2"><HiUser className="w-4 h-4" />{course.instructor?.name || "Instructor"}</div>
                <div className="flex items-center gap-2"><HiStar className="w-4 h-4 text-yellow-500" />{course.rating?.toFixed(1) || "New"} ({course.totalReviews || 0} reviews)</div>
                <div className="flex items-center gap-2"><HiClock className="w-4 h-4" />{course.totalDuration || 0} min total</div>
                <div className="flex items-center gap-2"><HiPlay className="w-4 h-4" />{lectures?.length || 0} lectures</div>
              </div>

              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {course.price > 0 ? `$${course.price}` : "Free"}
              </div>

              {isEnrolled ? (
                <div className="space-y-3">
                  {progress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{progress.completionPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress.completionPercentage || 0}%` }} />
                      </div>
                    </div>
                  )}
                  <span className="block text-center text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 py-2 rounded-lg font-medium">
                    Enrolled
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {enrolling ? "Enrolling..." : "Enroll Now"}
                </button>
              )}
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Course Content</h3>
              {lectures.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No lectures yet</p>
              ) : (
                <div className="space-y-1">
                  {lectures.map((lecture, i) => {
                    const isCompleted = completedLectureIds.includes(lecture._id);
                    const isSelected = selectedLecture?._id === lecture._id;
                    return (
                      <button
                        key={lecture._id}
                        onClick={() => setSelectedLecture(lecture)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          isSelected
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-50 dark:hover:bg-dark-bg/50 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : isEnrolled ? (
                          <HiPlay className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <HiLockClosed className="w-4 h-4 flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{lecture.title}</p>
                          <p className="text-xs text-gray-400">{lecture.duration || 0} min</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetail;
