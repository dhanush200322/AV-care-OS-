import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const SlideOver: React.FC<{ open: boolean; title: string; subtitle?: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: 'md' | 'lg' | 'xl' }> = ({
  open, title, subtitle, onClose, children, footer, width = 'lg',
}) => {
  const w = { md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-2xl' }[width];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className={cn('fixed right-0 top-0 z-[151] h-full w-full border-l border-[#00C2E0]/25 bg-[#050D14]/95 backdrop-blur-2xl flex flex-col', w)}>
            <header className="flex justify-between p-6 border-b border-white/10 shrink-0">
              <div><h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>{subtitle && <p className="text-xs text-[#7F95B2] mt-1 font-mono">{subtitle}</p>}</div>
              <button type="button" onClick={onClose} className="p-2 text-[#7F95B2] hover:text-white"><X size={20} /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">{children}</div>
            {footer && <footer className="p-6 border-t border-white/10 shrink-0 bg-[#0A1824]/80">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
