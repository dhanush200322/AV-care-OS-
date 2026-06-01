import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, MapPin, Siren, Radio, Users, Route, Wrench, HeartPulse, Network, Bell, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut, Ambulance, Sparkles, MessageSquare, Cake } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunicationUnread } from '../../hooks/useCommunicationUnread';
import { useAmbulanceStore } from '../../store/ambulanceStore';

const NAV = [
  { label: 'Operations', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gps', label: 'GPS Tracking', icon: MapPin },
    { id: 'requests', label: 'Emergency Requests', icon: Siren },
    { id: 'dispatch', label: 'Dispatch Center', icon: Radio },
    { id: 'drivers', label: 'Driver Management', icon: Users },
    { id: 'routes', label: 'Route Optimization', icon: Route },
    { id: 'fleet-health', label: 'Vehicle Health', icon: Wrench },
    { id: 'transport', label: 'Patient Transport', icon: HeartPulse },
  ]},
  { label: 'Command', items: [
    { id: 'coordination', label: 'Coordination', icon: Network },
    { id: 'alerts', label: 'Emergency Alerts', icon: Bell, badge: true },
    { id: 'messages', label: 'Communication', icon: MessageSquare },
    { id: 'birthdays', label: 'Birthday System', icon: Cake },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]},
];

export const AmbulanceSidebar: React.FC<{ activeTab: string; setActiveTab: (t: string) => void; onLogout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void }> = ({ activeTab, setActiveTab, onLogout, collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const commUnread = useCommunicationUnread('ambulance', user?.id);
  const { alerts, requests } = useAmbulanceStore();
  const critical = alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged).length;
  const pending = requests.filter((r) => r.status === 'Pending').length;

  return (
    <aside className={cn('h-screen flex flex-col border-r border-[#FF7A00]/20 bg-[#22140B]/80 backdrop-blur-2xl z-50 shrink-0 transition-all', collapsed ? 'w-[72px]' : 'w-[280px]')}>
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFA63D] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,122,0,0.35)]"><Ambulance className="text-[#140B05]" size={20} /></div>
        {!collapsed && <div><p className="text-sm font-bold text-white font-mono">AV CareOS</p><p className="text-[9px] text-[#FFA63D] uppercase tracking-widest">EMS Command</p></div>}
      </div>
      {!collapsed && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border border-[#FF7A00]/25 bg-[#140B05]/80">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-[#FF7A00]/20 border border-[#FFA63D]/40 flex items-center justify-center text-[#FFA63D] font-black text-sm">PN</div>
            <div><p className="text-sm font-bold text-white">Priya N.</p><p className="text-[10px] text-[#B8A28F]">Lead Dispatcher</p></div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#FF7A00]/20 text-[#FFA63D] border border-[#FF7A00]/30">Fleet Control — ON</span>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {NAV.map((g) => (
          <div key={g.label} className="mb-6">
            {!collapsed && <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-[#B8A28F]/50">{g.label}</p>}
            {g.items.map((item) => {
              const active = activeTab === item.id;
              const badge =
                item.id === 'messages'
                  ? commUnread
                  : item.id === 'alerts'
                    ? critical
                    : item.id === 'requests'
                      ? pending
                      : 0;
              return (
                <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} title={item.label} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 relative', active ? 'bg-[#FF7A00]/15 text-[#FFA63D] border border-[#FF7A00]/35 shadow-[0_0_16px_rgba(255,166,61,0.15)]' : 'text-[#B8A28F] hover:text-white hover:bg-white/5')}>
                  {active && <motion.div layoutId="amb-nav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FFA63D] rounded-r-full" />}
                  <item.icon size={18} />
                  {!collapsed && <span className="text-xs font-semibold flex-1 text-left">{item.label}</span>}
                  {badge > 0 && !collapsed && <span className="min-w-[18px] h-[18px] rounded-full bg-[#FF4444] text-[9px] font-bold text-white flex items-center justify-center animate-pulse">{badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
        <button type="button" onClick={() => setActiveTab('dispatch')} className={cn('w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-[#FFA63D]/35 bg-[#FF7A00]/15 text-[#FFA63D]', collapsed && 'justify-center')}><Sparkles size={18} />{!collapsed && <span className="text-xs font-bold">AI Dispatch</span>}</button>
      </nav>
      <div className="p-3 border-t border-white/10">
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="w-full flex justify-center gap-2 p-2 text-[#B8A28F]">{collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-[10px] font-bold uppercase">Collapse</span></>}</button>
        <button type="button" onClick={onLogout} className="w-full flex justify-center gap-2 p-2.5 mt-2 text-[#B8A28F] hover:text-[#FF4444]"><LogOut size={18} />{!collapsed && <span className="text-xs font-bold">Sign Out</span>}</button>
      </div>
    </aside>
  );
};
