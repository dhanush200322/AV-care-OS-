import { motion, AnimatePresence } from 'motion/react';
import React from 'react';
import { Role } from '../types';

interface BackgroundProps {
  selectedRole: Role;
  isPreview?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ selectedRole, isPreview = false }) => {
  return (
    <div id="background-container" className="fixed inset-0 z-0 overflow-hidden bg-slate-950 transition-colors duration-1000">
      {/* Primary Gradient Layer with smooth interpolation */}
      <motion.div 
        id="main-gradient"
        className="absolute inset-0 z-0"
        initial={false}
        animate={{
          background: `radial-gradient(circle at 50% 50%, ${selectedRole.gradient[0]} 0%, ${selectedRole.gradient[1]} 50%, ${selectedRole.gradient[2]} 100%)`,
          opacity: isPreview ? 0.3 : 1
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Atmospheric Fog Layers */}
      <motion.div
        animate={{
          background: `radial-gradient(circle at 50% -20%, ${selectedRole.color}33 0%, transparent 60%)`,
          opacity: isPreview ? 0.4 : 0.7
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-1"
      />

      {/* 3D Perspective Grid */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <motion.div 
          animate={{
            backgroundImage: `
              linear-gradient(${selectedRole.color}33 1px, transparent 1px), 
              linear-gradient(90deg, ${selectedRole.color}33 1px, transparent 1px)
            `
          }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundSize: '80px 80px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
          }} 
        />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Dynamic Colored Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          id={`particle-${i}`}
          className="absolute rounded-full blur-[2px]"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{ 
            y: ['0%', '-15%', '0%'],
            x: ['0%', (Math.random() - 0.5) * 8 + '%', '0%'],
            backgroundColor: selectedRole.color,
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ 
            duration: 5 + Math.random() * 10, 
            repeat: Infinity,
            ease: "easeInOut",
            backgroundColor: { duration: 1.5 }
          }}
          style={{
            width: Math.random() * 4 + 2 + 'px',
            height: Math.random() * 4 + 2 + 'px',
          }}
        />
      ))}

      {/* Pulse Ambient Glow */}
      <motion.div 
        animate={{
          backgroundColor: selectedRole.color,
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 4, repeat: Infinity, backgroundColor: { duration: 1.5 } }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] rounded-full mix-blend-screen pointer-events-none"
      />
    </div>
  );
};
