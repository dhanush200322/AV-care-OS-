import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Command, Siren, Sparkles, Sun, Moon, Wifi, WifiOff, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useSecurityStore } from '../../store/securityStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { btnGhost, btnDanger } from './theme';
import { NotificationBellPanel } from '../shared/communications/NotificationBellPanel';
import { normalizePortalRole } from '../../store/communicationStore';

export const SecurityTopNavbar: React.FC<{ onSearchClick: () => void; onAIToggle: () => void; scrolled?: boolean; onOpenCommunication?: () => void }> = ({ onSearchClick, onAIToggle, scrolled, onOpenCommunication }) => {
  const { theme, toggleTheme } = useTheme();
  const { isEmergencyMode, toggleEmergencyMode } = useStore();
  const { user } = useAuth();
  const { wsConnected, incidents } = useSecurityStore();
  const portalRole = normalizePortalRole('security') ?? 'security';
  const activeIncidents = incidents.filter((i) => i.status === 'Active' || i.status === 'Investigating').length;
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <motion.header animate={{ boxShadow: scrolled ? '0 8px 40px rgba(255,68,48,0.15)' : '0 4px 24px rgba(0,194,224,0.1)' }} className="sticky top-0 z-40 mx-4 mt-4 mb-2 rounded-2xl border border-[#00C2E0]/25 bg-[#0A1824]/85 backdrop-blur-xl px-4 py-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={onSearchClick} className="flex-1 min-w-[200px] max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#050D14]/90 border border-white/10 hover:border-[#00C2E0]/40 group">
        <Search size={16} className="text-[#7F95B2] group-hover:text-[#00E5FF]" />
        <span className="text-sm text-[#7F95B2] font-mono">Tactical search — visitors, cameras, incidents…</span>
        <kbd className="ml-auto hidden sm:flex px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#7F95B2]"><Command size={10} />K</kbd>
      </button>
      <div className={cn('hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase font-mono border', wsConnected ? 'border-[#00C2E0]/40 text-[#00E5FF] bg-[#00C2E0]/10' : 'border-[#FF4444]/40 text-[#FF4444]')}>
        {wsConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}{wsConnected ? 'FEEDS LIVE' : 'OFFLINE'}
      </div>
      <span className="hidden lg:block font-mono text-xs text-[#7F95B2] tabular-nums">{time.toLocaleTimeString()}</span>
      {activeIncidents > 0 && <span className="px-3 py-1 rounded-full bg-[#FF4444]/20 border border-[#FF4444]/40 text-[#FF4444] text-[10px] font-bold uppercase animate-pulse">{activeIncidents} INCIDENTS</span>}
      <button type="button" onClick={toggleEmergencyMode} className={cn(btnDanger, 'py-2', isEmergencyMode && 'animate-pulse')}><Siren size={16} />Emergency</button>
      <button type="button" onClick={onAIToggle} className={btnGhost}><Sparkles size={14} />AI</button>
      <NotificationBellPanel portalRole={portalRole} userId={user?.id} accentClass="text-[#00E5FF]" badgeClass="bg-[#1E6FFF]" onOpenCommunication={onOpenCommunication} />
      <button type="button" onClick={toggleTheme} className={btnGhost}>{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</button>
      <div className="flex items-center gap-2 pl-2 border-l border-white/10">
        <div className="hidden sm:block text-right"><p className="text-xs font-bold text-white font-mono">Officer Vikram S.</p><p className="text-[9px] text-[#00E5FF] flex items-center justify-end gap-1"><Activity size={10} /> On Patrol</p></div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00C2E0] to-[#1E6FFF] p-[1px]"><div className="w-full h-full rounded-[10px] bg-[#050D14] flex items-center justify-center text-[#00E5FF] font-black text-xs">VS</div></div>
      </div>
    </motion.header>
  );
};
