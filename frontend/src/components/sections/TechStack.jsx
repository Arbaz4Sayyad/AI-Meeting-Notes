import React from 'react';
import { motion } from 'framer-motion';
import {
  Atom,
  Database,
  Cloud,
  Shield,
  Container,
  Cpu
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const TechStack = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const techStack = [
    {
      name: "React",
      description: "Modern frontend framework",
      icon: Atom,
      color: "from-cyan-500 to-blue-500",
      category: "Frontend"
    },
    {
      name: "Spring Boot",
      description: "Enterprise Java backend",
      icon: Cpu,
      color: "from-green-500 to-emerald-500",
      category: "Backend"
    },
    {
      name: "PostgreSQL",
      description: "Reliable database",
      icon: Database,
      color: "from-blue-600 to-blue-700",
      category: "Database"
    },
    {
      name: "OpenAI Whisper",
      description: "Speech-to-text AI",
      icon: Cloud,
      color: "from-purple-500 to-pink-500",
      category: "AI"
    },
    {
      name: "Google Gemini",
      description: "AI summaries & insights",
      icon: Cpu,
      color: "from-orange-500 to-red-500",
      category: "AI"
    },
    {
      name: "Docker",
      description: "Container deployment",
      icon: Container,
      color: "from-blue-400 to-cyan-400",
      category: "DevOps"
    }
  ];

  const categories = ["Frontend", "Backend", "Database", "AI", "DevOps"];

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${isDark ? '#374151' : '#3b82f6'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Enterprise-Grade Technology
            </span>
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Built with
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Modern Tech Stack
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Powered by industry-leading technologies for reliability, scalability, and performance
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className={`group relative p-8 rounded-2xl transition-all duration-300 ${
                isDark
                  ? 'bg-gray-900 border border-gray-700'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: isDark
                  ? '0 20px 40px rgba(0,0,0,0.5)'
                  : '0 20px 40px rgba(0,0,0,0.15)',
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              {/* Category Badge */}
              <motion.div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {tech.category}
              </motion.div>

              {/* Icon */}
              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <tech.icon className="w-8 h-8 text-white" />
              </motion.div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {tech.name}
              </h3>
              <p className={`${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {tech.description}
              </p>

              {/* Hover Effect Lines */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Overview */}
        <motion.div
          className={`mt-16 p-8 rounded-2xl ${
            isDark
              ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className={`text-2xl font-bold mb-6 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Architecture Overview
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className={`p-6 rounded-xl text-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Frontend
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                React + Tailwind CSS
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl text-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Backend
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Spring Boot + PostgreSQL
              </p>
            </motion.div>

            <motion.div
              className={`p-6 rounded-xl text-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Services
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                OpenAI + Google Gemini
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
