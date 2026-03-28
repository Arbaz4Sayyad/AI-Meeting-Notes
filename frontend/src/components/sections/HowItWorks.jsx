import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Cpu,
  FileCheck,
  ArrowRight,
  Play,
  Zap,
  Brain
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const HowItWorks = () => {
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

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload or Record",
      description: "Record or upload your audio files in seconds.",
      details: ["Drag & drop upload", "Instant AI analysis", "Multiple formats"],
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      icon: Cpu,
      title: "AI Processing",
      description: "AI transcribes and extracts key highlights.",
      details: ["Speech-to-text", "Speaker identification", "Context analysis"],
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 3,
      icon: FileCheck,
      title: "Get Structured Notes",
      description: "Receive summaries and actionable clear notes.",
      details: ["Smart summaries", "Action items", "Full transcription"],
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <section id="how-it-works" className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(${isDark ? '#374151' : '#3b82f6'} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Play className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              How It Works
            </span>
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            From Audio to Insights in
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}3 Simple Steps
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform your meetings into actionable intelligence with our streamlined AI-powered workflow
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2"></div>

          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                variants={itemVariants}
              >
                {/* Step Card */}
                <motion.div
                  className={`relative p-8 rounded-2xl ${
                    isDark
                      ? 'bg-gray-900 border border-gray-700'
                      : 'bg-white border border-gray-200 shadow-lg'
                  }`}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    boxShadow: isDark
                      ? '0 30px 60px rgba(0,0,0,0.5)'
                      : '0 30px 60px rgba(0,0,0,0.15)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Number Badge */}
                  <motion.div
                    className={`absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mt-4`}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`mb-6 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detail}
                        className={`flex items-center text-sm ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${step.color} rounded-full mr-3`}></div>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Arrow Connector (Desktop) */}
                {index < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center`}>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Visual Flow (Mobile) */}
        <motion.div
          className="lg:hidden mt-12 flex items-center justify-center space-x-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {step.number}
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`text-center p-6 rounded-2xl ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">3 Minutes</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Average processing time
            </div>
          </motion.div>

          <motion.div
            className={`text-center p-6 rounded-2xl ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Transcription accuracy
            </div>
          </motion.div>

          <motion.div
            className={`text-center p-6 rounded-2xl ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI processing available
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
