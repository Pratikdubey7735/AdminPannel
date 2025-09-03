import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiUser, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const CoachForm = ({ coach, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: coach?.name || "",
    email: coach?.email || "",
    password: "",
    level: coach?.level || "beginner",
    status: coach?.status || "active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 25 + 25,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = coach
        ? `https://adminbackend-b9bo.onrender.com/api/coaches/${coach._id}`
        : "https://adminbackend-b9bo.onrender.com/api/coaches";
      
      const method = coach ? "put" : "post";

      const submitData = coach && !showUpdatePassword
        ? { ...formData, password: undefined }
        : formData;

      await axios[method](url, submitData);

      // ✅ Real-time update trigger if editing existing coach
      if (coach) {
        const apiKey = import.meta.env.VITE_ADMIN_API_KEY;

        // Send general user update
        await axios.post("https://adminbackend-b9bo.onrender.com/api/admin/trigger-update", {
          userId: coach._id,
          updatedData: {
            name: formData.name,
            email: formData.email,
            level: formData.level,
            status: formData.status,
          },
          apiKey,
        });

        // Emit level update if level changed
        if (formData.level !== coach.level) {
          await axios.post("https://adminbackend-b9bo.onrender.com/api/admin/update-coach-level", {
            userId: coach._id,
            newLevel: formData.level,
            updatedCoachData: {
              ...coach,
              level: formData.level,
            },
            apiKey,
          });
        }
      }

      toast.success(
        coach ? "Coach updated successfully!" : "Coach created successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-hidden"
      >
        {/* Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white bg-opacity-10"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -100],
                x: [0, (Math.random() - 0.5) * 50],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Glow Orb */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-3xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {coach ? "Edit Coach" : "Add New Coach"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-800"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-purple-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white"
                  />
                </div>
              </div>

              {(!coach || showUpdatePassword) && (
                <div>
                  <label className="block text-xs text-purple-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!coach || showUpdatePassword}
                      minLength={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              )}

              {coach && !showUpdatePassword && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowUpdatePassword(true)}
                    className="text-sm text-purple-400 hover:text-pink-400 flex items-center"
                  >
                    <FiLock className="mr-1" /> Update Password
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative">
                    <label className="absolute left-4 -top-3 px-1 text-xs bg-gray-900 text-purple-400">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white appearance-none"
                    >
                      <option value="beginner" className="bg-gray-800">Beginner</option>
                      <option value="senior" className="bg-gray-800">Senior</option>
                      <option value="master" className="bg-gray-800">Master</option>
                      <option value="Beginner" className="bg-gray-800">Beginner</option>
                      <option value="AdvancedBeginner" className="bg-gray-800">Advanced Beginner</option>
                      <option value="Intermediate" className="bg-gray-800">Intermediate</option>
                      <option value="AdvancedPart1" className="bg-gray-800">Advanced Part 1</option>
                      <option value="AdvancedPart2" className="bg-gray-800">Advanced Part 2</option>
                      <option value="SubJunior" className="bg-gray-800">Sub Junior</option>
                      <option value="Junior" className="bg-gray-800">Junior</option>
                      <option value="SeniorPart1" className="bg-gray-800"> Senior Part 1</option>
                      <option value="SeniorPart2" className="bg-gray-800"> Senior Part 2</option>
                    </select>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      whileFocus={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="relative">
                    <label className="absolute left-4 -top-3 px-1 text-xs bg-gray-900 text-purple-400">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white appearance-none"
                    >
                      <option value="active" className="bg-gray-800">Active</option>
                      <option value="suspended" className="bg-gray-800">Suspended</option>
                    </select>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      whileFocus={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition shadow-lg disabled:opacity-70 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {coach ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {coach ? <FiCheck className="mr-2" /> : <FiPlus className="mr-2" />}
                      {coach ? "Update Coach" : "Create Coach"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CoachForm;
