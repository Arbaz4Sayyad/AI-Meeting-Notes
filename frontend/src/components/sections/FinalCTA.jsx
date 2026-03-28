import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const FinalCTA = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

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

  const stats = [
    { value: "10,000+", label: "Active Users", icon: Users },
    { value: "4.9/5", label: "User Rating", icon: Star },
    { value: "99.9%", label: "Uptime", icon: Zap }
  ];

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.3, 0.2],
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
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Headline */}
          <motion.h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            variants={itemVariants}
          >
            Stop Taking Notes.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Start Making Decisions.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className={`text-xl sm:text-2xl mb-12 max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
            variants={itemVariants}
          >
            Join thousands of professionals transforming their meetings into 
            decision-making powerhouses today.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="mb-16"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-2xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.p
              className={`mt-4 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              No credit card required • Free 14-day trial • Cancel anytime
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`text-center p-6 rounded-2xl ${
                  isDark
                    ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
                    : 'bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-purple-500 to-purple-600' :
                    'from-green-500 to-green-600'
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className={`text-3xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial Preview */}
          <motion.div
            className={`max-w-4xl mx-auto p-8 rounded-2xl ${
              isDark
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                : 'bg-white border border-gray-200 shadow-xl'
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <blockquote className={`text-lg sm:text-xl mb-6 font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              "AI Meeting Notes has completely transformed how our team handles meetings. 
              We save hours every week and never miss important action items. 
              The accuracy is incredible!"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div className="text-left">
                <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  John Doe
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  CTO at TechCorp
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
