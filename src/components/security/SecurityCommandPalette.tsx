import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';

const CMDS = [
  { id: 'dashboard', label: 'Command Dashboard', group: 'Nav' },
  { id: 'visitors', label: 'Visitor Lookup', group: 'Ops' },
  { id: 'cctv', label: 'CCTV Grid', group: 'Surveillance' },
  { id: 'incidents', label: 'Open Incident', group: 'Critical' },
  { id: 'emergency', label: 'Emergency Response', group: 'Critical' },
  { id: 'alerts', label: 'Active Alerts', group: 'Alerts' },
];

export const SecurityCommandPalette: React.FC<{ open: boolean; onClose: () => void; onNavigate: (id: string) => void }> = ({ open, onClose, onNavigate }) => {
  const [q, setQ] = useState('');
  useEffect(() => { if (!open) setQ(''); }, [open]);
  const filtered = CMDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-[12%] z-[301] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-[#00C2E0]/30 bg-[#0A1824]/98 overflow-hidden font-mono">
            <div className="flex items-center gap-3 p-4 border-b border-white/10"><Search className="text-[#00E5FF]" size={18} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tactical command…" className="flex-1 bg-transparent text-white text-sm focus:outline-none" /></div>
            <ul className="max-h-80 overflow-y-auto p-2">{filtered.map((c) => (
              <li key={c.id}><button type="button" onClick={() => { onNavigate(c.id); onClose(); }} className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-[#00C2E0]/10 text-left group">
                <div><p className="text-sm text-white">{c.label}</p><p className="text-[10px] text-[#7F95B2] uppercase">{c.group}</p></div>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-[#00E5FF]" />
              </button></li>
            ))}</ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
