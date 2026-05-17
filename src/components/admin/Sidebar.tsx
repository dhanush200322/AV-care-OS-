
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Calendar, 
  Ambulance, 
  Building2, 
  Radio, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Hospital,
  CreditCard,
  Pill,
  FlaskConical
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'staff', label: 'Staff', icon: UserSquare2 },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: CreditCard,
    subItems: [
      { id: 'invoices', label: 'Invoices' },
      { id: 'payments', label: 'Payments' },
      { id: 'insurance', label: 'Insurance' },
      { id: 'refunds', label: 'Refunds' },
      { id: 'reports', label: 'Reports' },
    ]
  },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'lab-reports', label: 'Lab Reports', icon: FlaskConical },
  { id: 'ambulance', label: 'Ambulance', icon: Ambulance },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'broadcast', label: 'Broadcast', icon: Radio },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['billing']);

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-slate-950/50 backdrop-blur-3xl border-r border-white/10 flex flex-col relative z-50 overflow-hidden"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-4 mb-8">
        <div className="min-w-[48px] h-[48px] rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Hospital className="text-white" size={24} />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <span className="text-lg font-black tracking-tighter text-white">AV CARE</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-purple-400/80 font-bold">OPERATING SYSTEM</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isMainActive = activeTab === item.id || (item.subItems?.some(si => activeTab === `${item.id}-${si.id}`));
          const isExpanded = expandedMenus.includes(item.id);

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.id);
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isMainActive 
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {isMainActive && (
                  <motion.div 
                    layoutId="active-bar"
                    className="absolute left-0 top-1/4 w-[4px] h-1/2 bg-purple-500 rounded-full"
                  />
                )}
                <item.icon size={22} className={cn("transition-transform duration-300", isMainActive ? "scale-110" : "group-hover:scale-110")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left text-sm font-semibold tracking-wide">{item.label}</span>
                    {item.subItems && (
                      <ChevronRight 
                        size={14} 
                        className={cn("transition-transform", isExpanded && "rotate-90")} 
                      />
                    )}
                  </>
                )}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-gradient-to-r from-purple-500 to-transparent" />
              </button>

              {!isCollapsed && item.subItems && isExpanded && (
                <div className="ml-9 space-y-1 py-1 border-l border-white/5">
                  {item.subItems.map((sub) => {
                    const isSubActive = activeTab === `${item.id}-${sub.id}`;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(`${item.id}-${sub.id}`)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-black transition-all",
                          isSubActive ? "text-purple-400" : "text-slate-600 hover:text-slate-200"
                        )}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout / Collapse Section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
        >
          <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="text-sm font-bold tracking-widest uppercase">Logout</span>}
        </button>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Decorative Blur */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-[80px]" />
    </motion.aside>
  );
};
