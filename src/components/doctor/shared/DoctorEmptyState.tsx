import React from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { btnPrimary, glassCard } from '../theme';

interface DoctorEmptyStateProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const DoctorEmptyState: React.FC<DoctorEmptyStateProps> = ({
  title,
  description,
  onAction,
  actionLabel = 'Create New',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${glassCard} p-16 flex flex-col items-center text-center`}
  >
    <div className="w-16 h-16 rounded-2xl bg-[#00D68F]/10 border border-[#00D68F]/30 flex items-center justify-center mb-6">
      <Sparkles className="text-[#00FFA3]" size={28} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-[#8AA39B] max-w-sm mb-8">{description}</p>
    {onAction && (
      <button type="button" onClick={onAction} className={btnPrimary}>
        <Plus size={16} />
        {actionLabel}
      </button>
    )}
  </motion.div>
);
