import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Command, Siren, Sparkles, Sun, Moon, Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useAmbulanceStore } from '../../store/ambulanceStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { btnGhost, btnDanger } from './theme';
import { NotificationBellPanel } from '../shared/communications/NotificationBellPanel';
import { normalizePortalRole } from '../../store/communicationStore';

export const AmbulanceTopNavbar: React.FC<{ onSearchClick: () => void; onAIToggle: () => void; scrolled?: boolean; onOpenCommunication?: () => void }> = ({ onSearchClick, onAIToggle, scrolled, onOpenCommunication }) => {
  const { theme, toggleTheme } = useTheme();
  const { isEmergencyMode, toggleEmergencyMode } = useStore();
  const { user } = useAuth();
  const { wsConnected, dispatches } = useAmbulanceStore();
  const portalRole = normalizePortalRole('ambulance') ?? 'ambulance';
  const activeDispatch = dispatches.filter((d) => d.status === 'Active').length;
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <motion.header animate={{ boxShadow: scrolled ? '0 8px 40px rgba(255,122,0,0.15)' : 'none' }} className="sticky top-0 z-40 mx-4 mt-4 mb-2 rounded-2xl border border-[#FF7A00]/25 bg-[#22140B]/85 backdrop-blur-xl px-4 py-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={onSearchClick} className="flex-1 min-w-[200px] max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#140B05]/90 border border-white/10 hover:border-[#FF7A00]/40 group">
        <Search size={16} className="text-[#B8A28F] group-hover:text-[#FFA63D]" /><span className="text-sm text-[#B8A28F] font-mono">AI dispatch search…</span>
        <kbd className="ml-auto hidden sm:flex px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#B8A28F]"><Command size={10} />K</kbd>
      </button>
      <div className={cn('hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase font-mono border', wsConnected ? 'border-[#FF7A00]/40 text-[#FFA63D] bg-[#FF7A00]/10' : 'border-[#FF4444]/40 text-[#FF4444]')}>{wsConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}{wsConnected ? 'GPS LIVE' : 'OFFLINE'}</div>
      <span className="hidden lg:block font-mono text-xs text-[#B8A28F] tabular-nums">{time.toLocaleTimeString()}</span>
      {activeDispatch > 0 && <span className="px-3 py-1 rounded-full bg-[#FF7A00]/20 border border-[#FFA63D]/40 text-[#FFA63D] text-[10px] font-bold font-mono">{activeDispatch} ACTIVE</span>}
      <button type="button" onClick={toggleEmergencyMode} className={cn(btnDanger, 'py-2', isEmergencyMode && 'animate-pulse')}><Siren size={16} />SOS</button>
      <button type="button" onClick={onAIToggle} className={btnGhost}><Sparkles size={14} />AI</button>
      <NotificationBellPanel portalRole={portalRole} userId={user?.id} accentClass="text-[#FFA63D]" badgeClass="bg-[#FF7A00]" onOpenCommunication={onOpenCommunication} />
      <button type="button" onClick={toggleTheme} className={btnGhost}>{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</button>
      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
        <div className="hidden sm:block text-right"><p className="text-xs font-bold text-white font-mono">Priya N.</p><p className="text-[9px] text-[#FFA63D] flex items-center justify-end gap-1"><Activity size={10} /> Dispatch</p></div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFA63D] p-[1px]"><div className="w-full h-full rounded-[10px] bg-[#140B05] flex items-center justify-center text-[#FFA63D] font-black text-xs">PN</div></div>
      </div>
    </motion.header>
  );
};
