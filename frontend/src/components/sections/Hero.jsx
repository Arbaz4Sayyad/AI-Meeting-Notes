import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, Sparkles, Zap, Brain, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import AISummaryCard from './AISummaryCard';
import FloatingBlobs from './FloatingBlobs';

const Hero = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(true);
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const transcriptSegments = [
    { speaker: "Sarah", text: "I think we should prioritize the user onboarding flow...", color: "text-blue-500" },
    { speaker: "John", text: "Agreed. Let's also consider the mobile experience...", color: "text-green-500" },
    { speaker: "AI", text: "Key decision: Focus on mobile-first design approach", color: "text-purple-500" },
    { speaker: "Sarah", text: "We'll need to update the component library...", color: "text-blue-500" },
    { speaker: "John", text: "Timeline: 2 weeks for MVP, 4 weeks for full release", color: "text-green-500" }
  ];

  // Typing effect for transcript
  useEffect(() => {
    const currentSegment = transcriptSegments[currentTranscriptIndex];
    if (!currentSegment) return;

    setIsTyping(true);
    setDisplayedText('');
    
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < currentSegment.text.length) {
        setDisplayedText(prev => prev + currentSegment.text[charIndex]);
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        
        // Move to next segment after pause
        setTimeout(() => {
          setCurrentTranscriptIndex((prev) => (prev + 1) % transcriptSegments.length);
        }, 2000);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentTranscriptIndex]);

  // Recording animation
  useEffect(() => {
    const recordingInterval = setInterval(() => {
      setIsRecording(prev => !prev);
    }, 1500);
    
    return () => clearInterval(recordingInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const dashboardVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  return (
    <section className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Floating Background Blobs */}
      <FloatingBlobs />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="text-center lg:text-left" variants={containerVariants}>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 mb-6"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Powered by AI
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              variants={itemVariants}
            >
              Turn Meetings into{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Actionable Insights
              </span>
              <br />
              — Automatically
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className={`text-lg sm:text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
              variants={itemVariants}
            >
              Capture, transcribe, and summarize every session automatically. 
              Focus on the conversation, not on taking notes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate('/register')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full border-2 transition-all duration-300 ${
                  isDark
                    ? 'border-gray-600 text-white hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-8"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Instant Setup
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  99% Accuracy
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Secure & Private
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            className="relative"
            variants={dashboardVariants}
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div
                className={`rounded-2xl shadow-2xl overflow-hidden ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Dashboard Header */}
                <div className={`px-6 py-4 border-b ${
                  isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      AI Meeting Notes
                    </span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Meeting Title */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Q1 Product Planning Session
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        March 25, 2024
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                        Completed
                      </span>
                    </div>
                  </div>

                  {/* Transcription Preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        AI Transcription
                      </h4>
                      <motion.div
                        className="flex items-center space-x-2"
                      >
                        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                        <span className="text-xs text-blue-500 font-medium uppercase tracking-wider">
                          Analyzing Audio
                        </span>
                      </motion.div>
                    </div>
                    <div className={`p-3 rounded-lg font-mono text-sm relative overflow-hidden ${
                      isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {/* Previous transcripts */}
                      {transcriptSegments.slice(0, currentTranscriptIndex).map((segment, index) => (
                        <motion.p
                          key={index}
                          className="mb-2 opacity-60"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 0.6, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className={segment.color}>{segment.speaker}:</span> " {segment.text}"
                        </motion.p>
                      ))}
                      
                      {/* Current typing transcript */}
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentTranscriptIndex}
                          className="mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <span className={transcriptSegments[currentTranscriptIndex].color}>
                            {transcriptSegments[currentTranscriptIndex].speaker}:
                          </span> " {displayedText}"
                          {isTyping && (
                            <motion.span
                              className="inline-block w-2 h-4 bg-current ml-1"
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            />
                          )}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* AI Summary Card */}
                  <AISummaryCard />
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
