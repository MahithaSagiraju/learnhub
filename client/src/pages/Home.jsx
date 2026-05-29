import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiAcademicCap, HiCode, HiChartBar, HiStar } from "react-icons/hi";
import AnimatedPage from "../components/common/AnimatedPage";

const features = [
  { icon: HiAcademicCap, title: "Expert Courses", description: "Learn from industry experts" },
  { icon: HiCode, title: "Coding Challenges", description: "Practice with real coding problems" },
  { icon: HiChartBar, title: "Track Progress", description: "Monitor your learning journey" },
  { icon: HiStar, title: "AI Assistant", description: "Get help from AI tutor" },
];

const Home = () => {
  return (
    <AnimatedPage>
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Learn, Code, Grow with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Education
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Master in-demand skills with interactive courses, coding challenges, and personalized AI guidance.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/courses"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Everything You Need to Succeed
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gray-50 dark:bg-dark-bg rounded-xl text-center"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
};

export default Home;
