import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

const FloatingBlobs = () => {
  const { isDark } = useTheme();

  const blobs = [
    {
      id: 1,
      size: 'w-96 h-96',
      color: 'from-blue-500/20 to-purple-500/20',
      initialPosition: { x: '10%', y: '20%' },
      animation: {
        scale: [1, 1.3, 1],
        x: ['10%', '15%', '10%'],
        y: ['20%', '25%', '20%'],
      },
      duration: 8,
      delay: 0,
    },
    {
      id: 2,
      size: 'w-80 h-80',
      color: 'from-purple-500/15 to-pink-500/15',
      initialPosition: { x: '70%', y: '60%' },
      animation: {
        scale: [1.2, 1, 1.2],
        x: ['70%', '65%', '70%'],
        y: ['60%', '55%', '60%'],
      },
      duration: 10,
      delay: 2,
    },
    {
      id: 3,
      size: 'w-64 h-64',
      color: 'from-pink-500/15 to-orange-500/15',
      initialPosition: { x: '80%', y: '10%' },
      animation: {
        scale: [1, 1.4, 1],
        x: ['80%', '85%', '80%'],
        y: ['10%', '15%', '10%'],
      },
      duration: 12,
      delay: 4,
    },
    {
      id: 4,
      size: 'w-72 h-72',
      color: 'from-green-500/15 to-blue-500/15',
      initialPosition: { x: '20%', y: '70%' },
      animation: {
        scale: [1.3, 1, 1.3],
        x: ['20%', '15%', '20%'],
        y: ['70%', '75%', '70%'],
      },
      duration: 9,
      delay: 1,
    },
    {
      id: 5,
      size: 'w-56 h-56',
      color: 'from-yellow-500/15 to-red-500/15',
      initialPosition: { x: '50%', y: '40%' },
      animation: {
        scale: [1, 1.5, 1],
        x: ['50%', '55%', '50%'],
        y: ['40%', '35%', '40%'],
      },
      duration: 11,
      delay: 3,
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          className={`absolute ${blob.size} bg-gradient-to-br ${blob.color} rounded-full blur-3xl`}
          style={{
            left: blob.initialPosition.x,
            top: blob.initialPosition.y,
          }}
          animate={blob.animation}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: blob.delay,
          }}
        />
      ))}
      
      {/* Additional subtle background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default FloatingBlobs;
