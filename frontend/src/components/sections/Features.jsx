import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  FileText,
  CheckSquare,
  MessageSquare,
  Search,
  Bell,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import GlassmorphismCard from './GlassmorphismCard';

const Features = () => {
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

  const features = [
    {
      icon: Mic,
      title: "AI Transcription",
      description: "99% accurate speech-to-text with auto-speaker identification.",
      color: "from-blue-500 to-blue-600",
      lightColor: "from-blue-400 to-blue-500",
      stats: "99% Accuracy"
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "Instant extraction of the most important decisions and meeting context.",
      color: "from-purple-500 to-purple-600",
      lightColor: "from-purple-400 to-purple-500",
      stats: "7-Section Output"
    },
    {
      icon: CheckSquare,
      title: "Action Items Extraction",
      description: "Auto-identifies tasks and responsibilities directly from the transcript.",
      color: "from-green-500 to-green-600",
      lightColor: "from-green-400 to-green-500",
      stats: "Auto-Assignment"
    },
    {
      icon: MessageSquare,
      title: "AI Q&A",
      description: "Ask anything about your meetings and get instant, context-aware answers.",
      color: "from-pink-500 to-pink-600",
      lightColor: "from-pink-400 to-pink-500",
      stats: "Natural Language"
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find exactly what was said across all your past meetings instantly.",
      color: "from-orange-500 to-orange-600",
      lightColor: "from-orange-400 to-orange-500",
      stats: "Cross-Meeting"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Stay updated on new summaries and pending action items.",
      color: "from-indigo-500 to-indigo-600",
      lightColor: "from-indigo-400 to-indigo-500",
      stats: "Real-time"
    }
  ];

  return (
    <section id="features" className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Powerful Features
            </span>
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Productive Meetings
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our AI-powered platform transforms your meetings from time-wasters into decision-making powerhouses
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
            >
              <GlassmorphismCard className="p-8 h-full">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${isDark ? feature.color : feature.lightColor} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className={`text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                  
                  {/* Stats Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isDark ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100/50 text-gray-700'
                  }`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {feature.stats}
                  </div>
                </div>

                {/* Hover Effect Lines */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                />
              </GlassmorphismCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`inline-flex items-center px-6 py-3 rounded-full border ${
              isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trusted by teams worldwide
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
