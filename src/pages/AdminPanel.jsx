import { useState, useEffect } from "react";
import { AnimatePresence } from 'framer-motion';

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CoachForm from "./CoachForm";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck, FiUser, FiArrowLeft } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const CoachesDashboard = () => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCoach, setCurrentCoach] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [particles, setParticles] = useState([]);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const fetchCoaches = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/coaches");
      const data = await res.json();
      
      const coachesData = Array.isArray(data) ? data : 
                         (data.data && Array.isArray(data.data)) ? data.data : 
                         [];
      
      setCoaches(coachesData);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Failed to fetch coaches. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coach?")) return;
    
    try {
      await fetch(`http://localhost:5000/api/coaches/${id}`, {
        method: "DELETE",
      });
      toast.success("Coach deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      fetchCoaches();
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Failed to delete coach. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const filteredCoaches = (coaches || []).filter(coach => 
    coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.email.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const statusData = (filteredCoaches || []).reduce((acc, coach) => {
    acc[coach.status] = (acc[coach.status] || 0) + 1;
    return acc;
  }, {});

  const levelData = (filteredCoaches || []).reduce((acc, coach) => {
    acc[coach.level] = (acc[coach.level] || 0) + 1;
    return acc;
  }, {});

  const chartStatusData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value,
  }));

  const chartLevelData = Object.entries(levelData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative overflow-hidden">
      {/* Floating particles background */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-indigo-100 bg-opacity-20"
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
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-3xl -left-32 -top-32"
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

      <ToastContainer />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </motion.button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-gray-800"
            >
              Coaches Management
            </motion.h1>
            <p className="text-gray-500 mt-1">
              Manage and monitor all your coaching staff in one place
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search coaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setCurrentCoach(null);
                setIsFormOpen(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Coach</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Coaches", value: filteredCoaches.length, icon: <FiUser />, color: "indigo" },
            { title: "Active", value: statusData.active || 0, icon: "✓", color: "green" },
            { title: "Pending", value: statusData.pending || 0, icon: "⏱", color: "yellow" },
            { title: "Suspended", value: statusData.suspended || 0, icon: "⛔", color: "red" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${stat.color}-500 transition-all hover:shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-800">Coaches by Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-800">Coaches by Level</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartLevelData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.96)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#6366F1" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Coaches Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">Coaches List</h2>
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredCoaches.length}</span> of <span className="font-medium">{coaches.length}</span> coaches
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                {searchTerm ? "No matching coaches found" : "No coaches available"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get started by adding a new coach."}
              </p>
              {!searchTerm && (
                <motion.button
                  onClick={() => {
                    setCurrentCoach(null);
                    setIsFormOpen(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all inline-flex items-center"
                >
                  <FiPlus className="mr-2" />
                  Add Coach
                </motion.button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coach
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCoaches.map((coach) => (
                    <motion.tr 
                      key={coach._id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold">
                              {coach.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {coach.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(coach.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{coach.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              coach.level === "senior"
                                ? "bg-purple-100 text-purple-800"
                                : coach.level === "master"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                        >
                          {coach.level.charAt(0).toUpperCase() + coach.level.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              coach.status === "active"
                                ? "bg-green-100 text-green-800"
                                : coach.status === "suspended"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {coach.status.charAt(0).toUpperCase() + coach.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <motion.button
                          onClick={() => {
                            setCurrentCoach(coach);
                            setIsFormOpen(true);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-indigo-600 hover:text-indigo-900 p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(coach._id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Coach Form Modal */}
        {isFormOpen && (
          <CoachForm
            coach={currentCoach}
            onClose={() => {
              setIsFormOpen(false);
              setCurrentCoach(null);
            }}
            onSuccess={fetchCoaches}
          />
        )}
      </div>
    </div>
  );
};

export default CoachesDashboard;