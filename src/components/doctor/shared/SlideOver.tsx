import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SlideOverProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export const SlideOver: React.FC<SlideOverProps> = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 'lg',
}) => {
  const w = { md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-2xl' }[width];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed right-0 top-0 z-[151] h-full w-full border-l border-[#00D68F]/20 bg-[#071B11]/95 backdrop-blur-2xl shadow-[-20px_0_60px_rgba(0,214,143,0.12)] flex flex-col',
              w
            )}
          >
            <header className="flex items-start justify-between gap-4 p-6 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                {subtitle && <p className="text-xs text-[#8AA39B] mt-1">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-[#8AA39B] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">{children}</div>
            {footer && (
              <footer className="p-6 border-t border-white/10 shrink-0 bg-[#0D2818]/50">{footer}</footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
