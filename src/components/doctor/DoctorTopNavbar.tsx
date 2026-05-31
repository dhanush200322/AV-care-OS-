import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Command,
  Siren,
  Sparkles,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Plus,
  Activity,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useDoctorStore } from '../../store/doctorStore';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { btnGhost, btnPrimary } from './theme';
import { NotificationBellPanel } from '../shared/communications/NotificationBellPanel';
import { normalizePortalRole } from '../../store/communicationStore';

interface DoctorTopNavbarProps {
  onSearchClick: () => void;
  onAIToggle: () => void;
  scrolled?: boolean;
  onOpenCommunication?: () => void;
}

export const DoctorTopNavbar: React.FC<DoctorTopNavbarProps> = ({
  onSearchClick,
  onAIToggle,
  scrolled,
  onOpenCommunication,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isEmergencyMode, toggleEmergencyMode } = useStore();
  const { user } = useAuth();
  const { wsConnected } = useDoctorStore();
  const portalRole = normalizePortalRole('doctor') ?? 'doctor';
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        boxShadow: scrolled ? '0 8px 32px rgba(0,214,143,0.12)' : '0 4px 24px rgba(0,0,0,0.2)',
      }}
      className={cn(
        'sticky top-0 z-40 mx-4 mt-4 mb-2 rounded-2xl border border-[#00D68F]/20',
        'bg-[#0D2818]/75 backdrop-blur-xl px-4 py-3 flex flex-wrap items-center gap-3'
      )}
    >
      <button
        type="button"
        onClick={onSearchClick}
        className="flex-1 min-w-[200px] max-w-xl flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#071B11]/80 border border-white/10 hover:border-[#00D68F]/40 transition-all group"
      >
        <Search size={16} className="text-[#8AA39B] group-hover:text-[#00FFA3]" />
        <span className="text-sm text-[#8AA39B]">AI search patients, records, labs…</span>
        <kbd className="ml-auto hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#8AA39B] font-mono border border-white/10">
          <Command size={10} />K
        </kbd>
      </button>

      <div className="flex items-center gap-2 flex-wrap">
        <div
          className={cn(
            'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border',
            wsConnected
              ? 'border-[#00D68F]/30 text-[#00FFA3] bg-[#00D68F]/10'
              : 'border-[#FF4444]/30 text-[#FF4444] bg-[#FF4444]/10'
          )}
        >
          {wsConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}
          {wsConnected ? 'Live Sync' : 'Offline'}
        </div>

        <span className="hidden lg:block font-mono text-xs text-[#8AA39B] tabular-nums">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>

        <button type="button" className={btnGhost} title="Quick action">
          <Plus size={14} />
        </button>

        <button
          type="button"
          onClick={toggleEmergencyMode}
          className={cn(
            'p-2.5 rounded-xl border transition-all',
            isEmergencyMode
              ? 'bg-[#FF4444]/20 border-[#FF4444]/50 text-[#FF4444] animate-pulse'
              : 'border-white/10 text-[#8AA39B] hover:border-[#FF4444]/40 hover:text-[#FF4444]'
          )}
          aria-label="Emergency mode"
        >
          <Siren size={18} />
        </button>

        <button type="button" onClick={onAIToggle} className={btnPrimary}>
          <Sparkles size={14} />
          <span className="hidden sm:inline">AI</span>
        </button>

        <NotificationBellPanel
          portalRole={portalRole}
          userId={user?.id}
          accentClass="text-[#00FFA3]"
          badgeClass="bg-[#00FFA3] text-[#071B11]"
          onOpenCommunication={onOpenCommunication}
        />

        <button type="button" onClick={toggleTheme} className={btnGhost} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-white">Dr. Satish K.</p>
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#00FFA3] flex items-center justify-end gap-1">
              <Activity size={10} /> On Duty
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D68F] to-[#00FFA3] p-[1px]">
            <div className="w-full h-full rounded-[10px] bg-[#071B11] flex items-center justify-center text-[#00FFA3] font-black text-xs">
              SK
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
