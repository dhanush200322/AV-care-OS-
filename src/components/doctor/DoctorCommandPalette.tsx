import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const COMMANDS = [
  { id: 'dashboard', label: 'Go to Dashboard', group: 'Navigation' },
  { id: 'appointments', label: 'Appointments', group: 'Navigation' },
  { id: 'queue', label: 'Patient Queue', group: 'Navigation' },
  { id: 'ai-diagnosis', label: 'AI Diagnosis Assistant', group: 'AI' },
  { id: 'emergency', label: 'Emergency Alerts', group: 'Critical' },
  { id: 'prescriptions', label: 'New Prescription', group: 'Actions' },
  { id: 'telemedicine', label: 'Start Telemedicine', group: 'Actions' },
];

interface DoctorCommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const DoctorCommandPalette: React.FC<DoctorCommandPaletteProps> = ({
  open,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="fixed left-1/2 top-[15%] z-[301] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-[#00D68F]/30 bg-[#0D2818]/95 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,163,0.15)] overflow-hidden"
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="text-[#00FFA3]" size={18} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, patients, modules…"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-[#8AA39B]/50"
              />
              <kbd className="flex items-center gap-0.5 px-2 py-1 rounded bg-white/5 text-[10px] text-[#8AA39B] font-mono">
                <Command size={10} /> esc
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.map((cmd) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cmd.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#00D68F]/10 text-left group"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">{cmd.label}</p>
                      <p className="text-[10px] text-[#8AA39B] uppercase tracking-wider">{cmd.group}</p>
                    </div>
                    <ArrowRight size={14} className="text-[#8AA39B] group-hover:text-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
