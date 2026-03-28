import React from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Briefcase,
  GraduationCap,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const UseCases = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  const useCases = [
    {
      icon: Code,
      title: "Developers",
      description: "Capture technical standups and sprint planning.",
      features: ["Sprint planning", "Code reviews", "Retrospectives"],
      color: "from-blue-500 to-cyan-500",
      lightColor: "from-blue-400 to-cyan-400",
      stats: "40% Time Saved",
      image: "👨‍💻"
    },
    {
      icon: Briefcase,
      title: "Managers",
      description: "Track team performance and client meeting decisions.",
      features: ["Decision tracking", "Team meetings", "Client calls"],
      color: "from-purple-500 to-pink-500",
      lightColor: "from-purple-400 to-pink-400",
      stats: "60% Better Follow-up",
      image: "👔"
    },
    {
      icon: GraduationCap,
      title: "Students",
      description: "Generate instant study notes from lectures.",
      features: ["Lecture notes", "Study groups", "Research"],
      color: "from-green-500 to-emerald-500",
      lightColor: "from-green-400 to-emerald-400",
      stats: "2x Better Retention",
      image: "🎓"
    },
    {
      icon: Users,
      title: "Teams",
      description: "Collaborate with shared notes and action items.",
      features: ["Brainstorming", "Workshops", "Training"],
      color: "from-orange-500 to-red-500",
      lightColor: "from-orange-400 to-red-400",
      stats: "50% More Productive",
      image: "👥"
    }
  ];

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-4 h-4 mr-2 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Use Cases
            </span>
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Built for Every
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {" "}Professional
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Whether you're a developer, manager, student, or team leader, our AI adapts to your specific needs
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              className={`group relative overflow-hidden rounded-2xl ${
                isDark
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                boxShadow: isDark
                  ? '0 30px 60px rgba(0,0,0,0.5)'
                  : '0 30px 60px rgba(0,0,0,0.15)',
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? useCase.color : useCase.lightColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${isDark ? useCase.color : useCase.lightColor} rounded-2xl flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <useCase.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {useCase.title}
                      </h3>
                      <div className="text-3xl mt-1">{useCase.image}</div>
                    </div>
                  </div>
                  
                  {/* Stats Badge */}
                  <motion.div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {useCase.stats}
                  </motion.div>
                </div>

                {/* Description */}
                <p className={`mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {useCase.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {useCase.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className={`w-2 h-2 bg-gradient-to-r ${useCase.color} rounded-full`}
                        whileHover={{ scale: 1.5 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className={`text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Award Badge */}
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${useCase.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Hover Effect Bottom Line */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${useCase.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
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
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Join 10,000+ professionals already using AI Meeting Notes
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCases;
