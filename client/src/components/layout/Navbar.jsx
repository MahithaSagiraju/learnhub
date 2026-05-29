import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { HiMenu, HiX, HiBookOpen, HiUserGroup, HiShieldCheck, HiMoon, HiSun } from "react-icons/hi";
import { useState } from "react";
import useTheme from "../../hooks/useTheme";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LearnHub
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors" title={isDark ? "Light mode" : "Dark mode"}>
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <Link to="/courses" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
              Courses
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === "student" && (
                  <>
                    <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                      Dashboard
                    </Link>
                    <Link to="/progress" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                      Progress
                    </Link>
                    <Link to="/certificates" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                      Certificates
                    </Link>
                    <Link to="/ai" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                      AI Tools
                    </Link>
                  </>
                )}
                {(user?.role === "instructor" || user?.role === "admin") && (
                  <Link to="/instructor/dashboard" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                    <HiBookOpen className="w-4 h-4" /> Instructor
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2">
                    <HiShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors" title={isDark ? "Light mode" : "Dark mode"}>
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/courses" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Courses</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Dashboard</Link>
                <Link to="/progress" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Progress</Link>
                <Link to="/certificates" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Certificates</Link>
                <Link to="/ai" className="block px-3 py-2 text-gray-600 dark:text-gray-300">AI Tools</Link>
                {(user?.role === "instructor" || user?.role === "admin") && (
                  <Link to="/instructor/dashboard" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Instructor</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Admin</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-600 dark:text-gray-300">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
