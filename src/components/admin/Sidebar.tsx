
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Hospital,
  CreditCard,
  Pill,
  FlaskConical,
  Activity,
  FileText,
  Shield,
  Siren,
  MessageSquare,
  UserCircle,
  Gift,
  Sparkles,
  Package,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const MENU_GROUPS = [
  {
    name: 'Hospital Details',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'doctors', label: 'Doctors', icon: UserSquare2 },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'appointments', label: 'Appointments', icon: FileText },
      { id: 'lab-reports', label: 'Lab Reports', icon: FlaskConical },
      { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
      { id: 'billing', label: 'Billing', icon: CreditCard },
      { id: 'staff-hr', label: 'Staff & HR', icon: Briefcase },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'ambulance-service', label: 'Ambulance', icon: Siren },
      { id: 'messages', label: 'Communication', icon: MessageSquare },
      { id: 'birthdays', label: 'Birthday System', icon: Gift },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'ai-assistant-page', label: 'AI Assistant', icon: Sparkles },
      { id: 'notifications', label: 'Notifications', icon: Siren },
    ]
  },
  {
    name: 'Admin',
    items: [
      { id: 'roles', label: 'Roles & Permissions', icon: Shield },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'profile', label: 'Profile', icon: UserCircle },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let prevIsMobile = window.innerWidth < 1024;
    setIsCollapsed(prevIsMobile);

    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      if (isMobile !== prevIsMobile) {
        setIsCollapsed(isMobile);
        prevIsMobile = isMobile;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside
      className={cn(
        "h-screen bg-slate-950/50 backdrop-blur-3xl border-r border-white/10 flex flex-col relative z-50 overflow-hidden flex-shrink-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Logo Section */}
      <div className={cn("p-6 flex items-center gap-4 mb-4", isCollapsed ? "justify-center px-4" : "")}>
        <div className="min-w-[40px] h-[40px] rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] flex-shrink-0">
          <Hospital className="text-white" size={20} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="text-lg font-black tracking-tighter text-white">AV CARE<span className="text-purple-500">OS</span></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400 font-bold">Admin Dashboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto no-scrollbar pb-6">
        {MENU_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
                {t(group.name)}
              </h4>
            )}
            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const translatedLabel = t(item.label);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? translatedLabel : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive 
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-bar"
                      className="absolute left-0 top-1/4 w-[3px] h-1/2 bg-cyan-400 rounded-full"
                    />
                  )}
                  <div className={cn("p-1 rounded-lg transition-transform duration-300", isActive ? "text-cyan-400 scale-110" : "group-hover:scale-110 group-hover:text-purple-400")}>
                     <item.icon size={20} />
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1 text-left text-[13px] font-semibold tracking-wide whitespace-nowrap">
                       {translatedLabel}
                    </span>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-gradient-to-r from-purple-500 to-transparent" />
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout / Collapse Section */}
      <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
        <button
          onClick={onLogout}
          title={isCollapsed ? t('Logout') : undefined}
          className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all group", isCollapsed && "justify-center px-0")}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-xs font-bold tracking-widest uppercase">{t('Logout')}</span>}
        </button>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Decorative Blur */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
    </aside>
  );
};

