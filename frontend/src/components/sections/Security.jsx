import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  Server
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Security = () => {
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

  const securityFeatures = [
    {
      icon: Key,
      title: "JWT Authentication",
      description: "Secure token-based auth with automatic refresh handling.",
      details: ["256-bit encryption", "Auto-refresh tokens", "Session management"],
      status: "Active",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "OAuth2 Integration",
      description: "Enterprise-ready login via Google and GitHub accounts.",
      details: ["Google OAuth2", "GitHub OAuth2", "SSO ready"],
      status: "Active",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Lock,
      title: "Secure File Uploads",
      description: "Encrypted storage with virus scanning and access control.",
      details: ["End-to-end encryption", "Virus scanning", "Access control"],
      status: "Active",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Server,
      title: "Data Protection",
      description: "GDPR compliant handling with regular security audits.",
      details: ["GDPR compliant", "Regular audits", "Data retention policies"],
      status: "Compliant",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section className={`py-20 relative overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-white'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Enterprise Security
            </span>
          </motion.div>

          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Your Data is
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Protected
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Bank-level security with enterprise-grade authentication and data protection
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`group relative p-8 rounded-2xl transition-all duration-300 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200 shadow-lg'
              }`}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: isDark
                  ? '0 20px 40px rgba(0,0,0,0.5)'
                  : '0 20px 40px rgba(0,0,0,0.15)',
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                  feature.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : feature.status === 'Compliant'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  <CheckCircle className="w-3 h-3" />
                  <span>{feature.status}</span>
                </div>
              </motion.div>

              <motion.div
                className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className={`text-xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>

              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
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
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    {detail}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Security Alert */}
        <motion.div
          className={`mt-8 p-6 rounded-xl border-l-4 ${
            isDark
              ? 'bg-blue-900/20 border-blue-500'
              : 'bg-blue-50 border-blue-500'
          }`}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className={`w-5 h-5 mt-1 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-semibold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Enterprise Ready
              </h4>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Contact us for custom security configurations and dedicated instances.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Security;
