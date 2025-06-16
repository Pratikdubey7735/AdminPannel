import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiSettings, FiUser, FiArrowRight } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 md:p-12 text-center">
          {/* Avatar/User Profile */}
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
              <FiUser className="text-white text-4xl" />
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Welcome Back!
          </motion.h1>
          
          <motion.p 
            className="text-xl text-blue-100 mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            You're successfully logged in to your dashboard. Manage your account or explore the admin panel.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => navigate("/admin")}
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiSettings className="text-lg" />
              Admin Panel
              <FiArrowRight className="ml-1" />
            </motion.button>

            <motion.button
              onClick={handleLogout}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiLogOut className="text-lg" />
              Logout
            </motion.button>
          </motion.div>

          {/* Stats Cards (Optional) */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
           
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.p 
        className="text-white/70 mt-8 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} Upstep Academy. All rights reserved.
      </motion.p>
    </motion.div>
  );
};

export default Dashboard;