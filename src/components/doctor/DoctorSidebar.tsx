import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  FileText,
  Brain,
  Pill,
  FlaskConical,
  Video,
  Siren,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Hospital,
  Sparkles,
  Activity,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

const NAV_GROUPS = [
  {
    label: 'Clinical',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'queue', label: 'Patient Queue', icon: Users },
      { id: 'consultations', label: 'Consultations', icon: Stethoscope },
      { id: 'records', label: 'Medical Records', icon: FileText },
      { id: 'ai-diagnosis', label: 'AI Diagnosis', icon: Brain },
      { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
      { id: 'lab-reports', label: 'Lab Reports', icon: FlaskConical },
      { id: 'telemedicine', label: 'Telemedicine', icon: Video },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'emergency', label: 'Emergency Alerts', icon: Siren, badge: true },
      { id: 'messages', label: 'Messages', icon: MessageSquare },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

interface DoctorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  collapsed,
  setCollapsed,
}) => {
  const { notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;
  const [hospital, setHospital] = useState('AV Care Chennai HQ');

  useEffect(() => {
    const saved = localStorage.getItem('doctor_hospital');
    if (saved) setHospital(saved);
  }, []);

  return (
    <aside
      className={cn(
        'h-screen flex flex-col border-r border-[#00D68F]/15 bg-[#0D2818]/70 backdrop-blur-2xl z-50 shrink-0 transition-all duration-300 relative',
        collapsed ? 'w-[72px]' : 'w-[280px]'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D68F]/5 to-transparent pointer-events-none" />

      <div className={cn('p-4 flex items-center gap-3 border-b border-white/10', collapsed && 'justify-center')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D68F] to-[#00FFA3] flex items-center justify-center shadow-lg shadow-[#00D68F]/30 shrink-0">
          <Activity className="text-[#071B11]" size={20} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm font-bold text-white tracking-tight">AV CareOS</p>
              <p className="text-[9px] text-[#00FFA3] font-bold uppercase tracking-widest">Doctor Command</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!collapsed && (
        <div className="mx-4 mt-4 p-4 rounded-2xl border border-[#00D68F]/20 bg-[#071B11]/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00D68F] to-[#17C964] flex items-center justify-center text-[#071B11] font-black text-sm">
                SK
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FFA3] rounded-full border-2 border-[#071B11] animate-pulse" title="Online" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">Dr. Satish K.</p>
              <p className="text-[10px] text-[#8AA39B]">Senior Cardiologist</p>
            </div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#00D68F]/15 text-[#00FFA3] border border-[#00D68F]/25">
            Cardiology
          </span>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-[#8AA39B]">
            <Hospital size={12} className="text-[#00D68F]" />
            <select
              value={hospital}
              onChange={(e) => {
                setHospital(e.target.value);
                localStorage.setItem('doctor_hospital', e.target.value);
              }}
              className="bg-transparent text-[#8AA39B] text-[10px] focus:outline-none flex-1 cursor-pointer"
            >
              <option value="AV Care Chennai HQ">Chennai HQ</option>
              <option value="Mumbai Clinic">Mumbai Clinic</option>
              <option value="Delhi Emergency">Delhi Emergency</option>
            </select>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-2 no-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-[#8AA39B]/60">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = activeTab === item.id;
              const badge =
                item.id === 'messages'
                  ? unread
                  : item.id === 'emergency'
                    ? 1
                    : 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all relative group',
                    active
                      ? 'bg-[#00D68F]/15 text-[#00FFA3] border border-[#00D68F]/30 shadow-[0_0_20px_rgba(0,255,163,0.15)]'
                      : 'text-[#8AA39B] hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="doctor-nav-glow"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00FFA3] rounded-r-full shadow-[0_0_12px_#00FFA3]"
                    />
                  )}
                  <item.icon size={18} className={cn(active && 'text-[#00FFA3]')} />
                  {!collapsed && <span className="text-xs font-semibold">{item.label}</span>}
                  {badge > 0 && !collapsed && (
                    <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF4444] text-[9px] font-bold text-white flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        <button
          type="button"
          onClick={() => setActiveTab('ai-diagnosis')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-[#00D68F]/20 to-[#00C2E0]/10 border border-[#00FFA3]/30 text-[#00FFA3] hover:shadow-[0_0_24px_rgba(0,255,163,0.2)] transition-all',
            collapsed && 'justify-center'
          )}
        >
          <Sparkles size={18} />
          {!collapsed && <span className="text-xs font-bold">AI Clinical Shortcut</span>}
        </button>
      </nav>

      <div className="p-3 border-t border-white/10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center gap-2 p-2 rounded-xl text-[#8AA39B] hover:text-white hover:bg-white/5"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-[10px] font-bold uppercase tracking-wider">Collapse</span>}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center justify-center gap-2 p-2.5 rounded-xl text-[#8AA39B] hover:text-[#FF4444] hover:bg-[#FF4444]/10"
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-xs font-bold">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
