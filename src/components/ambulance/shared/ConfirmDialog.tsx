import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { btnGhost, btnPrimary, btnDanger, glassPanel } from '../theme';
import { cn } from '../../../lib/utils';
export const ConfirmDialog: React.FC<{ open: boolean; title: string; message: string; variant?: 'delete' | 'archive'; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }> = ({ open, title, message, variant = 'delete', confirmLabel, onConfirm, onCancel }) => (
  <AnimatePresence>{open && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm" onClick={onCancel} /><motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"><div className={cn(glassPanel, 'p-8 border-[#FF7A00]/20')}><Trash2 className="text-[#FF4444] mb-6" size={28} /><h2 className="text-xl font-bold text-white mb-2">{title}</h2><p className="text-sm text-[#B8A28F] mb-8">{message}</p><div className="flex gap-3 justify-end"><button type="button" onClick={onCancel} className={btnGhost}>Cancel</button><button type="button" onClick={onConfirm} className={variant === 'delete' ? btnDanger : btnPrimary}>{confirmLabel ?? 'Confirm'}</button></div></div></motion.div></>)}</AnimatePresence>
);
