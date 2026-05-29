import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiDownload, HiShieldCheck, HiAcademicCap, HiInbox } from "react-icons/hi";
import api from "../services/api";
import AnimatedPage from "../components/common/AnimatedPage";
import { SkeletonCard } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";
import toast from "react-hot-toast";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/certificates/my");
        setCertificates(res.data.data.certificates);
      } catch (error) {
        console.error("Failed to load certificates", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/api/certificates/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Certificate downloaded");
    } catch (error) {
      toast.error("Failed to download certificate");
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <HiAcademicCap className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Your earned course completion certificates</p>
          </div>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={HiInbox}
            title="No certificates yet"
            description="Complete a course to earn your first certificate"
          />
        ) : (
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border flex items-center justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
                    <HiShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{cert.course?.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Grade: <span className="font-medium text-primary">{cert.grade}</span>
                      {" · "}Score: {cert.score}%
                      {" · "}Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">ID: {cert.certificateId}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(cert._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                >
                  <HiDownload className="w-4 h-4" /> Download PDF
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Certificates;
