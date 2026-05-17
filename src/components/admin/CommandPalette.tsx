
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Command, 
  User, 
  Settings, 
  LayoutDashboard, 
  X,
  History,
  TrendingUp,
  FileText
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTIONS = [
  { id: 1, label: 'Patient Registry: James Wilson', category: 'Patients', icon: User },
  { id: 2, label: 'Staff Roster: Dr. Sarah Chen', category: 'Staff', icon: User },
  { id: 3, label: 'Analytics: Weekly Performance', category: 'View', icon: TrendingUp },
  { id: 4, label: 'System Configuration', category: 'Settings', icon: Settings },
  { id: 5, label: 'Audit Logs: Sector 7 Disconnect', category: 'Logs', icon: FileText },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [val, setVal] = useState('');

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // This is handled by the parent but just in case
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleDown);
    return () => window.removeEventListener('keydown', handleDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-[600px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-purple-500/10"
        >
          <div className="p-6 border-b border-white/5 flex items-center gap-4">
            <Search className="text-purple-500" size={24} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search across registries, archives, and system nodes..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-xl font-light text-white placeholder:text-white/10 tracking-tight"
            />
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-white/20 font-mono">
              ESC
            </div>
          </div>

          <div className="p-4 max-h-[400px] overflow-y-auto no-scrollbar">
            <div className="space-y-6">
              {/* Recents Section */}
              <div>
                <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 ml-1 flex items-center gap-2">
                  <History size={12} />
                  Recently Accessed
                </h4>
                <div className="space-y-1">
                  {SUGGESTIONS.map((item) => (
                    <button 
                      key={item.id}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-left group transition-colors"
                      onClick={() => {
                        console.log('Selected:', item.label);
                        onClose();
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-all">
                        <item.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">{item.category}</p>
                      </div>
                      <span className="text-[10px] text-white/10 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Jump to node</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Commands Section */}
              <div>
                <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 ml-1 flex items-center gap-2">
                   <Command size={12} />
                   Quick Commands
                </h4>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {[
                    { label: 'New Patient', cmd: '/p', icon: User },
                    { label: 'Broadcast', cmd: '/b', icon: LayoutDashboard },
                    { label: 'Settings', cmd: '/s', icon: Settings },
                    { label: 'Export Logs', cmd: '/x', icon: FileText }
                  ].map((cmd) => (
                    <div key={cmd.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                      <div className="flex items-center gap-3">
                         <cmd.icon size={14} className="text-white/20 group-hover:text-white" />
                         <span className="text-xs font-semibold text-white/60 group-hover:text-white">{cmd.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 group-hover:text-purple-400">{cmd.cmd}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-slate-900/50 flex items-center justify-between text-[10px] font-bold text-white/20 tracking-widest uppercase">
            <div className="flex gap-4">
               <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded border border-white/5">⏎</kbd> to select</span>
               <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1 rounded border border-white/5">↑↓</kbd> to navigate</span>
            </div>
            <span>AV CARE SEARCH PROTOCOL V1.2</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
