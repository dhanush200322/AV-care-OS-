import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight } from 'lucide-react';

const CMDS = [
  { id: 'dashboard', label: 'Command Dashboard', group: 'Nav' },
  { id: 'gps', label: 'Live GPS Map', group: 'Fleet' },
  { id: 'requests', label: 'Emergency Requests', group: 'Critical' },
  { id: 'dispatch', label: 'Dispatch Center', group: 'Ops' },
  { id: 'alerts', label: 'Active Alerts', group: 'Alerts' },
];

export const AmbulanceCommandPalette: React.FC<{ open: boolean; onClose: () => void; onNavigate: (id: string) => void }> = ({ open, onClose, onNavigate }) => {
  const [q, setQ] = useState('');
  useEffect(() => { if (!open) setQ(''); }, [open]);
  return (
    <AnimatePresence>{open && (<><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md" onClick={onClose} /><motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed left-1/2 top-[12%] z-[301] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-[#FF7A00]/30 bg-[#22140B]/98 overflow-hidden font-mono"><div className="flex items-center gap-3 p-4 border-b border-white/10"><Search className="text-[#FFA63D]" size={18} /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Dispatch command…" className="flex-1 bg-transparent text-white text-sm focus:outline-none" /></div><ul className="max-h-80 overflow-y-auto p-2">{CMDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())).map((c) => (<li key={c.id}><button type="button" onClick={() => { onNavigate(c.id); onClose(); }} className="w-full flex justify-between px-4 py-3 rounded-xl hover:bg-[#FF7A00]/10 text-left"><div><p className="text-sm text-white">{c.label}</p><p className="text-[10px] text-[#B8A28F]">{c.group}</p></div><ArrowRight size={14} className="text-[#FFA63D]" /></button></li>))}</ul></motion.div></>)}</AnimatePresence>
  );
};
