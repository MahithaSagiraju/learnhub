import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiUpload, HiDocument, HiCheck, HiClock } from "react-icons/hi";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/common/Loader";

const AssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const res = await api.get(`/assignments/${id}`);
      setAssignment(res.data.data.assignment);
      setMySubmission(res.data.data.mySubmission);
    } catch (error) {
      toast.error("Assignment not found");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return toast.error("Please enter your submission");
    setSubmitting(true);
    try {
      await api.post(`/assignments/${id}/submit`, { text });
      toast.success("Assignment submitted!");
      fetchAssignment();
    } catch (error) {
      toast.error(error.response?.data?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!assignment) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-border mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{assignment.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-500"><HiDocument className="w-4 h-4" />Total Marks: {assignment.totalMarks}</span>
            <span className="flex items-center gap-1 text-gray-500"><HiCheck className="w-4 h-4" />Passing: {assignment.passingMarks}</span>
            {assignment.dueDate && (
              <span className="flex items-center gap-1 text-gray-500"><HiClock className="w-4 h-4" />Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {mySubmission ? (
          <div className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-2 text-green-500 mb-4">
              <HiCheck className="w-5 h-5" />
              <span className="font-semibold">Submitted</span>
            </div>
            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{mySubmission.text}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Submitted: {new Date(mySubmission.submittedAt).toLocaleString()}</span>
              <span>Status: {mySubmission.status}</span>
              {mySubmission.marksObtained !== null && (
                <span className="font-semibold text-primary">Score: {mySubmission.marksObtained}/{assignment.totalMarks}</span>
              )}
            </div>
            {mySubmission.feedback && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Feedback:</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">{mySubmission.feedback}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-border">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Your Work</h2>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} required
              className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none mb-4"
              placeholder="Write your answer or paste code here..." />
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50">
              <HiUpload className="w-5 h-5" /> {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentPage;
