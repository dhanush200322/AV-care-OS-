import React from 'react';
import { Shield } from 'lucide-react';
import { btnPrimary, glassCard } from '../theme';

export const SecurityEmptyState: React.FC<{ title: string; description: string; onAction?: () => void; actionLabel?: string }> = ({
  title, description, onAction, actionLabel = 'Create',
}) => (
  <div className={`${glassCard} p-16 flex flex-col items-center text-center`}>
    <div className="w-16 h-16 rounded-2xl bg-[#00C2E0]/10 border border-[#00C2E0]/30 flex items-center justify-center mb-6"><Shield className="text-[#00E5FF]" size={28} /></div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-[#7F95B2] max-w-sm mb-8">{description}</p>
    {onAction && <button type="button" onClick={onAction} className={btnPrimary}>{actionLabel}</button>}
  </div>
);
