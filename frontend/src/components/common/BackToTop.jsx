import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDark } = useTheme();

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: isDark 
              ? "0 0 20px rgba(99, 102, 241, 0.6)" 
              : "0 0 20px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all duration-300 ${
            isDark 
              ? 'bg-slate-900/80 border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]' 
              : 'bg-white/80 border-blue-200 text-blue-600 shadow-lg'
          }`}
          title="Back to Top"
        >
          {/* Pulsing Glow behind the button */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ${
              isDark ? 'bg-indigo-500/20' : 'bg-blue-500/10'
            }`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Animated Arrow Icon */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronUp className="w-6 h-6 relative z-10" />
          </motion.div>
          
          {/* Progress ring/border simulation */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-indigo-500 opacity-20 pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
