import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight } from 'lucide-react';

const CMDS = [
  { id: 'dashboard', label: 'Dashboard', group: 'Nav' },
  { id: 'registration', label: 'New Patient Registration', group: 'Actions' },
  { id: 'appointments', label: 'Appointments', group: 'Nav' },
  { id: 'queue', label: 'Queue Tokens', group: 'Nav' },
  { id: 'billing', label: 'Billing Counter', group: 'Nav' },
  { id: 'tracker', label: 'Live Tracker', group: 'Nav' },
];

export const ReceptionCommandPalette: React.FC<{ open: boolean; onClose: () => void; onNavigate: (id: string) => void }> = ({ open, onClose, onNavigate }) => {
  const [q, setQ] = useState('');
  useEffect(() => { if (!open) setQ(''); }, [open]);
  const filtered = CMDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-[15%] z-[301] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-[#00C2A8]/30 bg-[#0D262B]/95 backdrop-blur-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="text-[#00FFD5]" size={18} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Commands, patients, modules…" className="flex-1 bg-transparent text-white text-sm focus:outline-none" />
              <kbd className="text-[10px] text-[#89A9B0] font-mono">esc</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.map((c) => (
                <li key={c.id}><button type="button" onClick={() => { onNavigate(c.id); onClose(); }} className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-[#00C2A8]/10 text-left group">
                  <div><p className="text-sm text-white font-medium">{c.label}</p><p className="text-[10px] text-[#89A9B0] uppercase">{c.group}</p></div>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-[#00FFD5]" />
                </button></li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
