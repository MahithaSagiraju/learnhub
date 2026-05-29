import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { instructorService } from "../services/instructorService";

const categories = [
  "Web Development", "Mobile Development", "Data Science", "Machine Learning",
  "DevOps", "Cloud Computing", "Cybersecurity", "Programming Languages", "Database", "AI",
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Web Development", level: "beginner", price: 0, tags: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title.length < 3) return toast.error("Title must be at least 3 characters");
    if (form.description.length < 20) return toast.error("Description must be at least 20 characters");

    setLoading(true);
    try {
      const res = await instructorService.createCourse({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      toast.success("Course created!");
      navigate(`/instructor/courses/${res.data.data.course._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-xl p-8 shadow-sm border border-gray-200 dark:border-dark-border space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., Mastering React Development" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Describe what students will learn..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level</label>
              <select name="level" value={form.level} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} min={0}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="0 = Free" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="react, javascript, frontend" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
              {loading ? "Creating..." : "Create Course"}
            </button>
            <button type="button" onClick={() => navigate("/instructor/dashboard")}
              className="border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 font-medium py-2.5 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCourse;
