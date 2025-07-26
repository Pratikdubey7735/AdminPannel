import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AuthForm = ({ title, onSubmit, buttonText, isLogin }) => {
  const [activeInput, setActiveInput] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  // Create floating particles
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

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 overflow-hidden relative">
      {/* Floating particles background */}
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

      {/* Glowing orb */}
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
        className="w-full max-w-md mx-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="bg-gray-900 bg-opacity-70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-700 border-opacity-50"
          whileHover={{ scale: 1.005 }}
        >
          <div className="text-center mb-10">
            <motion.h1
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLogin ? "Welcome back! Ready to continue?" : "Join us today! Let's get started."}
            </motion.p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 ${
                    activeInput === "email"
                      ? "text-xs -top-3 px-1 bg-gray-900 text-purple-400"
                      : "text-sm top-3 text-gray-400"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onFocus={() => handleInputFocus("email")}
                  onBlur={handleInputBlur}
                  placeholder={activeInput === "email" ? "" : ""}
                  required
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: activeInput === "email" ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-300 ${
                    activeInput === "password"
                      ? "text-xs -top-3 px-1 bg-gray-900 text-purple-400"
                      : "text-sm top-3 text-gray-400"
                  }`}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                  placeholder={activeInput === "password" ? "" : ""}
                  required
                  className="w-full px-4 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: activeInput === "password" ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>

            {isLogin && (
              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href="#"
                  className="text-sm text-purple-400 hover:text-pink-400 transition-colors"
                >
                  Forgot password?
                </a>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <button
                type="submit"
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-500 group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {buttonText}
                  <motion.span
                    className="ml-2"
                    animate={{
                      x: isHovered ? [0, 5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isHovered ? Infinity : 0,
                    }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  animate={{ x: isHovered ? "100%" : "-100%" }}
                  transition={{
                    duration: 1.2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </button>
            </motion.div>

            <motion.div
              className="text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-400 font-medium hover:text-pink-400 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-400 font-medium hover:text-pink-400 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </motion.div>
          </form>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-10 right-10 text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-2">
          <div className="h-1 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;