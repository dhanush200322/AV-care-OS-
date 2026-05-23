import React from 'react';
import { motion } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { btnPrimary, glassCard } from '../theme';

export const ReceptionEmptyState: React.FC<{ title: string; description: string; onAction?: () => void; actionLabel?: string }> = ({
  title, description, onAction, actionLabel = 'Create New',
}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${glassCard} p-16 flex flex-col items-center text-center`}>
    <div className="w-16 h-16 rounded-2xl bg-[#00C2A8]/10 border border-[#00C2A8]/30 flex items-center justify-center mb-6"><Sparkles className="text-[#00FFD5]" size={28} /></div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-[#89A9B0] max-w-sm mb-8">{description}</p>
    {onAction && <button type="button" onClick={onAction} className={btnPrimary}><Plus size={16} />{actionLabel}</button>}
  </motion.div>
);
