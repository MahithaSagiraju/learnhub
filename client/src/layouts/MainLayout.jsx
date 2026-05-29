import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AIDoubtAssistant from "../components/ai/AIDoubtAssistant";

const MainLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <AIDoubtAssistant />}
    </div>
  );
};

export default MainLayout;
