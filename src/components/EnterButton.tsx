import { motion } from 'motion/react';
import React from 'react';
import { Role } from '../types';
import { ArrowRight } from 'lucide-react';

interface EnterButtonProps {
  selectedRole: Role;
}

export const EnterButton: React.FC<EnterButtonProps> = ({ selectedRole }) => {
  return (
    <motion.button
      id="enter-system-button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative px-16 py-4 bg-transparent rounded-full text-sm font-bold tracking-[0.3em] uppercase overflow-hidden border transition-all duration-500"
      style={{
        borderColor: selectedRole.color,
        color: selectedRole.color,
      }}
    >
      {/* External Glow Layer */}
      <div 
        className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ backgroundColor: selectedRole.color }}
      />
      
      {/* Sliding Background Fill */}
      <motion.div
        initial={{ y: '100%' }}
        whileHover={{ y: 0 }}
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundColor: selectedRole.color }}
      />

      <span className="relative z-10 flex items-center gap-3">
        Enter System <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </span>
    </motion.button>
  );
};
