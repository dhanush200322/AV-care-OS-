import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Bell, Command, Siren, Sparkles, Sun, Moon, Wifi, WifiOff, UserPlus, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useReceptionStore } from '../../store/receptionStore';
import { useTheme } from '../../contexts/ThemeContext';
import { btnGhost, btnPrimary } from './theme';

interface Props { onSearchClick: () => void; onAIToggle: () => void; onQuickRegister: () => void; scrolled?: boolean; }

export const ReceptionTopNavbar: React.FC<Props> = ({ onSearchClick, onAIToggle, onQuickRegister, scrolled }) => {
  const { theme, toggleTheme } = useTheme();
  const { notifications, isEmergencyMode, toggleEmergencyMode } = useStore();
  const { wsConnected } = useReceptionStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <motion.header animate={{ boxShadow: scrolled ? '0 8px 32px rgba(0,194,168,0.12)' : 'none' }} className="sticky top-0 z-40 mx-4 mt-4 mb-2 rounded-2xl border border-[#00C2A8]/20 bg-[#0D262B]/75 backdrop-blur-xl px-4 py-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={onSearchClick} className="flex-1 min-w-[200px] max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#071A1D]/80 border border-white/10 hover:border-[#00C2A8]/40 group">
        <Search size={16} className="text-[#89A9B0] group-hover:text-[#00FFD5]" />
        <span className="text-sm text-[#89A9B0]">AI search patients, tokens, bills…</span>
        <kbd className="ml-auto hidden sm:flex px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#89A9B0]"><Command size={10} />K</kbd>
      </button>
      <div className={cn('hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border', wsConnected ? 'border-[#00C2A8]/30 text-[#00FFD5] bg-[#00C2A8]/10' : 'border-[#FF4444]/30 text-[#FF4444]')}>
        {wsConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}{wsConnected ? 'Live Sync' : 'Offline'}
      </div>
      <span className="hidden lg:block font-mono text-xs text-[#89A9B0] tabular-nums">{time.toLocaleTimeString()}</span>
      <button type="button" onClick={onQuickRegister} className={btnPrimary}><UserPlus size={14} /><span className="hidden sm:inline">Register</span></button>
      <button type="button" onClick={toggleEmergencyMode} className={cn('p-2.5 rounded-xl border', isEmergencyMode ? 'bg-[#FF4444]/20 border-[#FF4444]/50 text-[#FF4444] animate-pulse' : 'border-white/10 text-[#89A9B0]')}><Siren size={18} /></button>
      <button type="button" onClick={onAIToggle} className={btnGhost}><Sparkles size={14} />AI</button>
      <button type="button" className="relative p-2.5 rounded-xl border border-white/10"><Bell size={18} />{unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-[#00FFD5] text-[#071A1D] text-[9px] font-black flex items-center justify-center">{unread}</span>}</button>
      <button type="button" onClick={toggleTheme} className={btnGhost}>{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</button>
      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
        <div className="hidden sm:block text-right"><p className="text-xs font-bold text-white">Ananya Reddy</p><p className="text-[9px] text-[#00FFD5] flex items-center justify-end gap-1"><Activity size={10} /> On Duty</p></div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD5] p-[1px]"><div className="w-full h-full rounded-[10px] bg-[#071A1D] flex items-center justify-center text-[#00FFD5] font-black text-xs">AR</div></div>
      </div>
    </motion.header>
  );
};
