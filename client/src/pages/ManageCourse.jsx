import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiPlus, HiTrash, HiPencil } from "react-icons/hi";
import toast from "react-hot-toast";
import { instructorService } from "../services/instructorService";
import Loader from "../components/common/Loader";

const ManageCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddLecture, setShowAddLecture] = useState(false);
  const [lectureForm, setLectureForm] = useState({ title: "", videoUrl: "", duration: 0, description: "", moduleIndex: 0, isPreview: false });

  const fetchCourse = async () => {
    try {
      const res = await instructorService.getCourseDetails(id);
      setData(res.data.data);
    } catch (error) {
      toast.error("Course not found");
      navigate("/instructor/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourse(); }, [id]);

  const handleAddLecture = async (e) => {
    e.preventDefault();
    try {
      await instructorService.addLecture(id, lectureForm);
      toast.success("Lecture added");
      setShowAddLecture(false);
      setLectureForm({ title: "", videoUrl: "", duration: 0, description: "", moduleIndex: 0, isPreview: false });
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await instructorService.deleteLecture(lectureId);
      toast.success("Lecture deleted");
      fetchCourse();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const togglePublish = async () => {
    try {
      const newStatus = data.course.status === "published" ? "draft" : "published";
      await instructorService.updateCourse(id, { status: newStatus });
      toast.success(`Course ${newStatus === "published" ? "published" : "unpublished"}`);
      fetchCourse();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader text="Loading course..." />;
  if (!data) return null;

  const { course, lectures = [], quizzes = [], challenges = [], assignments = [] } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 capitalize">{course.category} • {course.level} • {course.status}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={togglePublish}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                course.status === "published"
                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
              }`}>
              {course.status === "published" ? "Unpublish" : "Publish"}
            </button>
            <button onClick={() => navigate(`/instructor/courses/${id}/edit`)}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
              <HiPencil className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lectures ({lectures.length})</h2>
                <button onClick={() => setShowAddLecture(!showAddLecture)}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark font-medium">
                  <HiPlus className="w-4 h-4" /> Add Lecture
                </button>
              </div>

              {showAddLecture && (
                <form onSubmit={handleAddLecture} className="mb-6 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg space-y-3">
                  <input type="text" placeholder="Lecture title" required
                    value={lectureForm.title} onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <input type="url" placeholder="Video URL (Cloudinary/YouTube)" required
                    value={lectureForm.videoUrl} onChange={(e) => setLectureForm({ ...lectureForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Duration (mins)"
                      value={lectureForm.duration} onChange={(e) => setLectureForm({ ...lectureForm, duration: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
                    <input type="number" placeholder="Module index"
                      value={lectureForm.moduleIndex} onChange={(e) => setLectureForm({ ...lectureForm, moduleIndex: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <input type="text" placeholder="Description (optional)"
                    value={lectureForm.description} onChange={(e) => setLectureForm({ ...lectureForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none" />
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <input type="checkbox" checked={lectureForm.isPreview}
                      onChange={(e) => setLectureForm({ ...lectureForm, isPreview: e.target.checked })} />
                    Preview (free)
                  </label>
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark">
                    Add Lecture
                  </button>
                </form>
              )}

              {lectures.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No lectures yet</p>
              ) : (
                <div className="space-y-2">
                  {lectures.map((lecture, i) => (
                    <div key={lecture._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-6">{i + 1}.</span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{lecture.title}</p>
                          <p className="text-xs text-gray-500">{lecture.duration || 0} min{lecture.isPreview ? " • Preview" : ""}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteLecture(lecture._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Course Content</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1"><span className="text-gray-500">Lectures</span><span className="font-medium">{lectures.length}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Quizzes</span><span className="font-medium">{quizzes.length}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Challenges</span><span className="font-medium">{challenges.length}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Assignments</span><span className="font-medium">{assignments.length}</span></div>
                <div className="flex justify-between py-1"><span className="text-gray-500">Students</span><span className="font-medium">{course.studentsEnrolled?.length || 0}</span></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-accent rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-1">Quick Actions</h3>
              <p className="text-sm opacity-90 mb-4">Add quizzes, coding challenges, and more</p>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors">Add Quiz</button>
                <button className="w-full text-left px-3 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors">Add Coding Challenge</button>
                <button className="w-full text-left px-3 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors">Add Assignment</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageCourse;
