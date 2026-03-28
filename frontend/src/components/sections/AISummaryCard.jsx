import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const AISummaryCard = () => {
  const { isDark } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [generatedSections, setGeneratedSections] = useState([]);

  const summarySections = [
    {
      title: "Key Decisions",
      icon: CheckCircle,
      content: "Team agreed to prioritize mobile-first design approach for Q1 roadmap",
      keywords: ["mobile-first", "Q1 roadmap", "design approach"],
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Action Items",
      icon: Target,
      content: "Sarah to lead component library updates, John to handle mobile responsive testing",
      keywords: ["component library", "responsive testing", "lead"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Timeline",
      icon: Clock,
      content: "MVP delivery in 2 weeks, full release targeted for 4 weeks with user testing",
      keywords: ["MVP", "2 weeks", "4 weeks", "user testing"],
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Next Steps",
      icon: TrendingUp,
      content: "Schedule design review meeting, update project documentation, allocate resources",
      keywords: ["design review", "documentation", "resources"],
      color: "from-orange-500 to-red-500"
    }
  ];

  // Simulate AI generation
  useEffect(() => {
    const generationInterval = setInterval(() => {
      if (isGenerating && currentSection < summarySections.length) {
        setTimeout(() => {
          setGeneratedSections(prev => [...prev, summarySections[currentSection]]);
          setCurrentSection(prev => prev + 1);
        }, 800);
      } else if (currentSection >= summarySections.length) {
        setIsGenerating(false);
      }
    }, 1200);

    return () => clearInterval(generationInterval);
  }, [isGenerating, currentSection]);

  const startGeneration = () => {
    setIsGenerating(true);
    setCurrentSection(0);
    setGeneratedSections([]);
  };

  const resetGeneration = () => {
    setIsGenerating(false);
    setCurrentSection(0);
    setGeneratedSections([]);
  };

  return (
    <motion.div
      className={`relative p-6 rounded-2xl ${
        isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Summary
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Generated in 2.3 seconds
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={isGenerating ? resetGeneration : startGeneration}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            isGenerating
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isGenerating ? 'Cancel' : 'Regenerate'}
        </motion.button>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI is analyzing your meeting...
            </span>
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          </div>
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentSection / summarySections.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* Generated Sections */}
      <div className="space-y-4">
        <AnimatePresence>
          {generatedSections.map((section, index) => (
            <motion.div
              key={section.title}
              className={`p-4 rounded-xl border ${
                isDark
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
              }`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <motion.div
                  className={`w-10 h-10 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <section.icon className="w-5 h-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {section.title}
                  </h4>
                  <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {section.content}
                  </p>
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {section.keywords.map((keyword, keywordIndex) => (
                      <motion.span
                        key={keyword}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDark
                            ? 'bg-gray-700 text-gray-300'
                            : 'bg-white text-gray-700 border border-gray-200'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + keywordIndex * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {!isGenerating && generatedSections.length === 0 && (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Brain className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Click "Regenerate" to see AI summary in action
          </p>
        </motion.div>
      )}

      {/* Footer Stats */}
      <motion.div
        className={`mt-6 pt-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center space-x-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <span>Accuracy: 98.7%</span>
            <span>•</span>
            <span>Model: Gemini Pro</span>
            <span>•</span>
            <span>Tokens: 1,247</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="w-3 h-3 text-yellow-500"
                style={{ opacity: 0.3 + (i * 0.15) }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AISummaryCard;
