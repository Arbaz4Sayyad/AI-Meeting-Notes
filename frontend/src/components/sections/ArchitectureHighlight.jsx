import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Brain, BarChart3, ArrowRight, Zap, Shield, Database } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ArchitectureHighlight = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Secure audio recording or file upload (MP3, WAV, M4A)",
      color: "bg-blue-500",
      delay: 0
    },
    {
      icon: Cpu,
      title: "Transcription",
      description: "OpenAI Whisper processes speech-to-text with multi-speaker support",
      color: "bg-purple-500",
      delay: 0.2
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Google Gemini analyzes context and extracts structured data",
      color: "bg-pink-500",
      delay: 0.4
    },
    {
      icon: BarChart3,
      title: "Insights",
      description: "Structured summaries, action items, and searchable data",
      color: "bg-green-500",
      delay: 0.6
    }
  ];

  return (
    <section id="architecture" className={`py-24 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? '#4b5563' : '#9ca3af'} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4"
          >
            <Zap className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold uppercase tracking-wider">System Architecture</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            High-Performance Pipeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Our robust backend infrastructure ensures fast processing and enterprise-grade security for your meeting data.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 -translate-y-1/2 opacity-20"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.5 }}
                className="relative group"
              >
                <div className={`p-8 rounded-2xl h-full transition-all duration-300 ${
                  isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700/50' : 'bg-white border-gray-100 hover:shadow-xl'
                } border`}>
                  <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {step.description}
                  </p>

                  {/* Icon Indicator (Desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white dark:bg-gray-800 items-center justify-center shadow-md border dark:border-gray-700 font-bold text-gray-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Highlights */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className={`mt-16 p-8 rounded-3xl border ${
            isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50/50 border-blue-100'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="mt-1 p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Enterprise Security</h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>End-to-end encryption for all audio files and generated notes.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Robust Data Layer</h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>PostgreSQL with optimized indexing for lightning-fast semantic search.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Scalable Processing</h4>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Asynchronous processing queues handle high volumes without delay.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectureHighlight;
