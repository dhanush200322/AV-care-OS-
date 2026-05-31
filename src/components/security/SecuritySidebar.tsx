import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard, Users, DoorOpen, Video, AlertTriangle, Lock, Car, Bell, Siren,
  BarChart3, Settings, ChevronLeft, ChevronRight, LogOut, Shield, Sparkles, Building2, MessageSquare,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunicationUnread } from '../../hooks/useCommunicationUnread';
import { useSecurityStore } from '../../store/securityStore';

const NAV = [
  { label: 'Command', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'visitors', label: 'Visitor Tracking', icon: Users },
    { id: 'access-logs', label: 'Entry/Exit Logs', icon: DoorOpen },
    { id: 'cctv', label: 'CCTV Monitoring', icon: Video },
    { id: 'incidents', label: 'Incident Center', icon: AlertTriangle },
    { id: 'restricted', label: 'Restricted Zones', icon: Lock },
    { id: 'parking', label: 'Parking', icon: Car },
  ]},
  { label: 'Response', items: [
    { id: 'alerts', label: 'Security Alerts', icon: Bell, badge: true },
    { id: 'emergency', label: 'Emergency Response', icon: Siren },
    { id: 'messages', label: 'Communication', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]},
];

export const SecuritySidebar: React.FC<{ activeTab: string; setActiveTab: (t: string) => void; onLogout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void }> = ({
  activeTab, setActiveTab, onLogout, collapsed, setCollapsed,
}) => {
  const { user } = useAuth();
  const commUnread = useCommunicationUnread('security', user?.id);
  const { alerts, incidents } = useSecurityStore();
  const criticalAlerts = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged).length;
  const activeInc = incidents.filter((i) => i.status === 'Active' || i.status === 'Investigating').length;
  const [facility, setFacility] = useState('Chennai HQ — Alpha Shift');

  return (
    <aside className={cn('h-screen flex flex-col border-r border-[#00C2E0]/20 bg-[#0A1824]/80 backdrop-blur-2xl z-50 shrink-0 transition-all', collapsed ? 'w-[72px]' : 'w-[280px]')}>
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C2E0] to-[#1E6FFF] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.3)]"><Shield className="text-[#050D14]" size={20} /></div>
        {!collapsed && <div><p className="text-sm font-bold text-white font-mono">AV CareOS</p><p className="text-[9px] text-[#00E5FF] uppercase tracking-widest">Security Command</p></div>}
      </div>
      {!collapsed && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border border-[#00C2E0]/25 bg-[#050D14]/80">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-[#1E6FFF]/30 border border-[#00C2E0]/40 flex items-center justify-center text-[#00E5FF] font-black text-sm font-mono">VS</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00D68F] rounded-full border-2 border-[#050D14] animate-pulse" />
            </div>
            <div><p className="text-sm font-bold text-white">Officer Vikram S.</p><p className="text-[10px] text-[#7F95B2]">Shift Lead</p></div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#FF4444]/15 text-[#FF4444] border border-[#FF4444]/30 animate-pulse">Threat Level: Elevated</span>
          <select value={facility} onChange={(e) => setFacility(e.target.value)} className="mt-3 w-full bg-transparent text-[10px] text-[#7F95B2] focus:outline-none"><option>Chennai HQ — Alpha</option><option>Mumbai — Bravo</option></select>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {NAV.map((g) => (
          <div key={g.label} className="mb-6">
            {!collapsed && <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-[#7F95B2]/50">{g.label}</p>}
            {g.items.map((item) => {
              const active = activeTab === item.id;
              const badge =
                item.id === 'messages'
                  ? commUnread
                  : item.id === 'alerts'
                    ? criticalAlerts
                    : item.id === 'incidents'
                      ? activeInc
                      : 0;
              return (
                <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} title={item.label} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 relative', active ? 'bg-[#00C2E0]/15 text-[#00E5FF] border border-[#00C2E0]/35 shadow-[0_0_16px_rgba(0,229,255,0.12)]' : 'text-[#7F95B2] hover:text-white hover:bg-white/5')}>
                  {active && <motion.div layoutId="sec-nav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00E5FF] rounded-r-full shadow-[0_0_12px_#00E5FF]" />}
                  <item.icon size={18} />
                  {!collapsed && <span className="text-xs font-semibold flex-1 text-left">{item.label}</span>}
                  {badge > 0 && !collapsed && <span className="min-w-[18px] h-[18px] rounded-full bg-[#FF4444] text-[9px] font-bold text-white flex items-center justify-center animate-pulse">{badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
        <button type="button" onClick={() => setActiveTab('cctv')} className={cn('w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-[#00E5FF]/30 bg-[#1E6FFF]/10 text-[#00E5FF]', collapsed && 'justify-center')}>
          <Sparkles size={18} />{!collapsed && <span className="text-xs font-bold">AI Surveillance</span>}
        </button>
      </nav>
      <div className="p-3 border-t border-white/10">
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="w-full flex justify-center gap-2 p-2 text-[#7F95B2]">{collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-[10px] font-bold uppercase">Collapse</span></>}</button>
        <button type="button" onClick={onLogout} className="w-full flex justify-center gap-2 p-2.5 mt-2 text-[#7F95B2] hover:text-[#FF4444]"><LogOut size={18} />{!collapsed && <span className="text-xs font-bold">Sign Out</span>}</button>
      </div>
    </aside>
  );
};
