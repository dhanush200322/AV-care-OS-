import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, UserPlus, Calendar, ListOrdered, Radio, CreditCard, Armchair,
  Bell, Headphones, MessageSquare, BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, Hospital, Sparkles, Building2,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const NAV = [
  { label: 'Operations', items: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registration', label: 'Patient Registration', icon: UserPlus },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'queue', label: 'Queue Management', icon: ListOrdered },
    { id: 'tracker', label: 'Live Tracker', icon: Radio },
    { id: 'billing', label: 'Billing Counter', icon: CreditCard },
    { id: 'waiting-hall', label: 'Waiting Hall', icon: Armchair },
  ]},
  { label: 'Support', items: [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'helpdesk', label: 'Help Desk', icon: Headphones },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]},
];

interface Props { activeTab: string; setActiveTab: (t: string) => void; onLogout: () => void; collapsed: boolean; setCollapsed: (v: boolean) => void; }

export const ReceptionSidebar: React.FC<Props> = ({ activeTab, setActiveTab, onLogout, collapsed, setCollapsed }) => {
  const { notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [hospital, setHospital] = useState('AV Care Chennai HQ');

  useEffect(() => {
    const s = localStorage.getItem('reception_hospital');
    if (s) setHospital(s);
  }, []);

  return (
    <aside className={cn('h-screen flex flex-col border-r border-[#00C2A8]/15 bg-[#0D262B]/70 backdrop-blur-2xl z-50 shrink-0 transition-all', collapsed ? 'w-[72px]' : 'w-[280px]')}>
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C2A8] to-[#00FFD5] flex items-center justify-center shrink-0"><Building2 className="text-[#071A1D]" size={20} /></div>
        {!collapsed && <div><p className="text-sm font-bold text-white">AV CareOS</p><p className="text-[9px] text-[#00FFD5] font-bold uppercase tracking-widest">Front Desk</p></div>}
      </div>

      {!collapsed && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border border-[#00C2A8]/20 bg-[#071A1D]/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00C2A8] to-[#00C2E0] flex items-center justify-center text-[#071A1D] font-black text-sm">AR</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FFD5] rounded-full border-2 border-[#071A1D] animate-pulse" />
            </div>
            <div><p className="text-sm font-bold text-white">Ananya Reddy</p><p className="text-[10px] text-[#89A9B0]">Lead Receptionist</p></div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#00C2A8]/15 text-[#00FFD5] border border-[#00C2A8]/25">Front Desk</span>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-[#89A9B0]">
            <Hospital size={12} className="text-[#00C2A8]" />
            <select value={hospital} onChange={(e) => { setHospital(e.target.value); localStorage.setItem('reception_hospital', e.target.value); }} className="bg-transparent flex-1 focus:outline-none cursor-pointer">
              <option>Chennai HQ</option><option>Mumbai Clinic</option><option>Delhi Center</option>
            </select>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {NAV.map((g) => (
          <div key={g.label} className="mb-6">
            {!collapsed && <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#89A9B0]/60">{g.label}</p>}
            {g.items.map((item) => {
              const active = activeTab === item.id;
              const badge = item.id === 'notifications' ? unread : 0;
              return (
                <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} title={item.label} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all relative', active ? 'bg-[#00C2A8]/15 text-[#00FFD5] border border-[#00C2A8]/30 shadow-[0_0_20px_rgba(0,255,213,0.12)]' : 'text-[#89A9B0] hover:text-white hover:bg-white/5')}>
                  {active && <motion.div layoutId="recv-nav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00FFD5] rounded-r-full" />}
                  <item.icon size={18} />
                  {!collapsed && <span className="text-xs font-semibold flex-1 text-left">{item.label}</span>}
                  {badge > 0 && !collapsed && <span className="min-w-[18px] h-[18px] rounded-full bg-[#FF4444] text-[9px] font-bold text-white flex items-center justify-center">{badge}</span>}
                </button>
              );
            })}
          </div>
        ))}
        <button type="button" onClick={() => setActiveTab('registration')} className={cn('w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-[#00C2A8]/20 to-[#00C2E0]/10 border border-[#00FFD5]/30 text-[#00FFD5]', collapsed && 'justify-center')}>
          <Sparkles size={18} />{!collapsed && <span className="text-xs font-bold">Quick Register</span>}
        </button>
      </nav>

      <div className="p-3 border-t border-white/10">
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 p-2 text-[#89A9B0] hover:text-white">{collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span className="text-[10px] font-bold uppercase">Collapse</span></>}</button>
        <button type="button" onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-2.5 mt-2 text-[#89A9B0] hover:text-[#FF4444]"><LogOut size={18} />{!collapsed && <span className="text-xs font-bold">Sign Out</span>}</button>
      </div>
    </aside>
  );
};
