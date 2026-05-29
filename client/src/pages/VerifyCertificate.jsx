import { useState } from "react";
import { motion } from "framer-motion";
import { HiSearch, HiShieldCheck, HiXCircle } from "react-icons/hi";
import api from "../services/api";

const VerifyCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.get(`/api/certificates/verify/${certificateId.trim()}`);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid certificate ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <HiShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify Certificate</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Enter a certificate ID to verify its authenticity</p>
        </div>

        <form onSubmit={handleVerify} className="flex gap-3 mb-8">
          <input
            type="text"
            value={certificateId}
            onChange={(e) => setCertificateId(e.target.value)}
            placeholder="Enter certificate ID (e.g., CERT-XXXX-XXXX)"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={loading || !certificateId.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            <HiSearch className="w-4 h-4" /> {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <HiXCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-card rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-semibold">Valid Certificate</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-gray-500">Certificate ID</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.certificate.certificateId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-gray-500">Student Name</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.certificate.studentName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-gray-500">Course</span>
                <span className="font-medium text-gray-900 dark:text-white">{result.certificate.courseTitle}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                <span className="text-gray-500">Grade</span>
                <span className="font-medium text-primary">{result.certificate.grade}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Issue Date</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(result.certificate.issueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
