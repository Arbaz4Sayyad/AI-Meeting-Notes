import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Target,
  ArrowRight,
  Clock,
  Lightbulb
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ProblemSolution = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const problems = [
    {
      icon: FileText,
      title: "Manual Note-Taking is Slow",
      description: "Participation drops when you're busy typing.",
      color: "text-red-500",
      bgColor: isDark ? "bg-red-900/20" : "bg-red-50",
    },
    {
      icon: Users,
      title: "Important Decisions are Missed",
      description: "Key insights often vanish after the call ends.",
      color: "text-orange-500",
      bgColor: isDark ? "bg-orange-900/20" : "bg-orange-50",
    },
    {
      icon: AlertCircle,
      title: "Action Items are Forgotten",
      description: "Tasks and deadlines are easily overlooked.",
      color: "text-yellow-500",
      bgColor: isDark ? "bg-yellow-900/20" : "bg-yellow-50",
    },
  ];

  const solutions = [
    {
      icon: Zap,
      title: "AI-Powered Transcription",
      description: "99% accurate speech-to-text with speaker identification.",
      color: "text-blue-500",
      bgColor: isDark ? "bg-blue-900/20" : "bg-blue-50",
    },
    {
      icon: Target,
      title: "Smart Summaries",
      description: "Instant extraction of decisions and key context.",
      color: "text-green-500",
      bgColor: isDark ? "bg-green-900/20" : "bg-green-50",
    },
    {
      icon: CheckCircle,
      title: "Action Item Tracking",
      description: "Assigned tasks with automated tracking.",
      color: "text-purple-500",
      bgColor: isDark ? "bg-purple-900/20" : "bg-purple-50",
    },
  ];

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${isDark ? '#374151' : '#e5e7eb'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            The Meeting Problem,
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Solved
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Transform chaotic conversations into structured, actionable insights
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problems Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    The Old Way
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Inefficient and error-prone
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  className={`p-6 rounded-2xl border ${
                    isDark 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: isDark 
                      ? '0 10px 30px rgba(0,0,0,0.5)' 
                      : '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${problem.bgColor}`}>
                      <problem.icon className={`w-6 h-6 ${problem.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {problem.title}
                      </h4>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {problem.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Solutions Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    The AI Way
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Automated and intelligent
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  className={`p-6 rounded-2xl border ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                  }`}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: isDark 
                      ? '0 10px 30px rgba(0,0,0,0.5)' 
                      : '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${solution.bgColor}`}>
                      <solution.icon className={`w-6 h-6 ${solution.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {solution.title}
                      </h4>
                      <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Arrow Connection */}
        <motion.div
          className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSolution;
