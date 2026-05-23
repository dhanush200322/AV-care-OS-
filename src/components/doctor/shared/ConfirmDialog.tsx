import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Archive, Trash2 } from 'lucide-react';
import { btnGhost, btnPrimary, glassPanel } from '../theme';
import { cn } from '../../../lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  variant?: 'delete' | 'archive' | 'warning';
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  variant = 'delete',
  confirmLabel,
  loading,
  onConfirm,
  onCancel,
}) => {
  const Icon = variant === 'archive' ? Archive : variant === 'warning' ? AlertTriangle : Trash2;
  const accent =
    variant === 'delete' ? 'text-[#FF4444] border-[#FF4444]/30' : variant === 'archive' ? 'text-[#FFB800] border-[#FFB800]/30' : 'text-[#00D68F] border-[#00D68F]/30';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <div className={cn(glassPanel, 'p-8 border shadow-2xl', accent)}>
              <div className={cn('w-14 h-14 rounded-2xl border flex items-center justify-center mb-6', accent, 'bg-white/5')}>
                <Icon size={28} />
              </div>
              <h2 id="confirm-title" className="text-xl font-bold text-white mb-2">
                {title}
              </h2>
              <p className="text-sm text-[#8AA39B] mb-8 leading-relaxed">{message}</p>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={onCancel} className={btnGhost}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    btnPrimary,
                    variant === 'delete' && 'from-[#FF4444] to-[#FF6B6B] shadow-[#FF4444]/25'
                  )}
                >
                  {loading ? 'Processing…' : confirmLabel ?? (variant === 'archive' ? 'Archive' : 'Confirm')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
