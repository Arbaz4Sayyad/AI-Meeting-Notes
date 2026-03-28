import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const GlassmorphismCard = ({ children, className = '', ...props }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      className={`relative backdrop-blur-md bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl ${className}`}
      whileHover={{
        scale: 1.02,
        boxShadow: isDark
          ? '0 25px 50px rgba(0, 0, 0, 0.3)'
          : '0 25px 50px rgba(0, 0, 0, 0.1)',
      }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/10 rounded-2xl pointer-events-none" />
      
      {/* Inner content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassmorphismCard;
