import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiSearch, HiStar, HiUser, HiBookOpen } from "react-icons/hi";
import api from "../services/api";
import AnimatedPage from "../components/common/AnimatedPage";
import { SkeletonCard } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [category, level, page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (level) params.level = level;
      if (search) params.search = search;
      const res = await api.get("/courses", { params });
      setCourses(res.data.data.courses);
      setCategories(res.data.data.categories);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      console.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <AnimatedPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Explore Courses</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Discover courses crafted by industry experts. Learn at your own pace with AI-powered guidance.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition-colors">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3 mb-8">
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={HiBookOpen}
            title="No courses found"
            description="Try adjusting your search or filters"
            action={
              <button onClick={() => { setSearch(""); setCategory(""); setLevel(""); setPage(1); }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors">
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-dark-card rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-md transition-all group"
                >
                  <Link to={`/courses/${course._id}`}>
                    <div className="h-40 bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center relative overflow-hidden">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <span className="text-white font-bold text-lg px-4 text-center">{course.title}</span>
                      )}
                      {course.price > 0 && (
                        <span className="absolute top-3 right-3 bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                          ${course.price}
                        </span>
                      )}
                      {course.price === 0 && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Free
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{course.category}</span>
                      <span className="text-xs px-2 py-0.5 bg-purple/10 text-accent rounded-full capitalize">{course.level}</span>
                    </div>
                    <Link to={`/courses/${course._id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><HiUser className="w-3 h-3" />{course.instructor?.name || "Instructor"}</span>
                      <span className="flex items-center gap-1"><HiStar className="w-3 h-3 text-yellow-500" />{course.rating?.toFixed(1) || "New"}</span>
                      <span>{course.studentsEnrolled?.length || 0} enrolled</span>
                    </div>
                    <Link to={`/courses/${course._id}`}
                      className="block text-center text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white py-2 rounded-lg transition-colors font-medium">
                      View Course
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-primary text-white"
                        : "bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
    </AnimatedPage>
  );
};

export default Courses;
