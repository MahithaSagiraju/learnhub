import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Page not found</p>
        <Link to="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
