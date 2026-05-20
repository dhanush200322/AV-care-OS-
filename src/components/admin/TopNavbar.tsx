
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Command,
  ChevronDown,
  Globe,
  Sparkles,
  Info,
  AlertCircle,
  Siren,
  Hospital
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

interface TopNavbarProps {
  onLogout: () => void;
  onSearchClick: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout, onSearchClick }) => {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { notifications, clearAllNotifications, markNotificationAsRead, isEmergencyMode, toggleEmergencyMode } = useStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4",
      scrolled || isEmergencyMode ? "bg-[#050816]/80 backdrop-blur-3xl border-b py-3" : "bg-transparent",
      isEmergencyMode ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : "border-white/5"
    )}>
      {/* Branch & Language Selector (Left) */}
      <div className="flex flex-wrap items-center gap-4">
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 text-[11px] font-black uppercase tracking-widest">
            <Hospital size={14} className="text-purple-400" />
            <span>Chennai HQ</span>
            <ChevronDown size={12} className="text-white/40" />
         </button>
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 text-[11px] font-black uppercase tracking-widest hidden sm:flex">
            <Globe size={14} className="text-cyan-400" />
            <span>EN-IN</span>
            <ChevronDown size={12} className="text-white/40" />
         </button>
      </div>

      {/* Search Trigger (Center-ish) */}
      <div 
        onClick={onSearchClick}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-full border text-slate-500 transition-all cursor-pointer group w-full md:max-w-md",
          isEmergencyMode ? "bg-red-500/10 border-red-500/20 hover:border-red-500/50" : "bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/10 shadow-inner"
        )}
      >
        <Search size={16} className={cn("transition-colors", isEmergencyMode ? "text-red-400" : "group-hover:text-purple-400")} />
        <span className={cn("text-xs font-medium tracking-wide flex-1 italic", isEmergencyMode ? "text-red-400/40" : "text-white/30")}>
          {isEmergencyMode ? "SYSTEM IN LOCKDOWN" : "Ask AI, search patients, audit logs..."}
        </span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px] font-bold text-white/50">
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      {/* Actions (Right) */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Emergency Mode Toggle */}
        <button 
          onClick={toggleEmergencyMode}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-500 group overflow-hidden relative",
            isEmergencyMode 
              ? "bg-red-500 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
              : "bg-white/5 border-white/10 text-white/40 hover:border-red-500/50 hover:text-red-500"
          )}
        >
           {isEmergencyMode && (
             <motion.div 
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
             />
           )}
           <Siren size={14} className={cn(isEmergencyMode && "animate-bounce")} />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] hidden sm:block">
             {isEmergencyMode ? "SLA BREACH ACTIVE" : "EMERGENCY"}
           </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all relative group"
          >
            <Bell size={18} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-[#050816] text-[8px] font-black flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {isNoteOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 rounded-2xl bg-slate-900 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-4 backdrop-blur-3xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black tracking-widest uppercase text-white/40">Communications</h3>
                  <span 
                    onClick={clearAllNotifications}
                    className="text-[10px] text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    Clear All
                  </span>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={cn(
                        "flex gap-3 p-2.5 rounded-xl transition-colors cursor-pointer group relative border border-transparent",
                        !notif.read ? "bg-white/[0.03] border-white/5" : "hover:bg-white/[0.02]"
                      )}
                    >
                      {!notif.read && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                        notif.type === 'emergency' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 
                        notif.type === 'broadcast' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                      )}>
                        {notif.type === 'emergency' ? <AlertCircle size={14} /> : 
                         notif.type === 'broadcast' ? <Sparkles size={14} /> : <Info size={14} />}
                      </div>
                      <div className="flex-1 pr-4">
                        <p className={cn(
                          "text-[11px] leading-relaxed mb-1",
                          notif.read ? "text-slate-400" : "text-white font-medium"
                        )}>
                          {notif.message}
                        </p>
                        <p className="text-[9px] font-bold tracking-widest uppercase text-slate-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 opacity-40">
                      <Bell size={24} className="mx-auto mb-2 text-white/20" />
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">System Nominal</p>
                    </div>
                  )}
                </div>
                <button className="w-full mt-4 py-2.5 rounded-xl bg-purple-500/10 text-purple-400 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-purple-500/20 transition-colors">
                  View System Logs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <User size={16} className="text-white" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-0.5">Admin</p>
              <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-tighter">Hospital OS</p>
            </div>
            <ChevronDown size={12} className={cn("text-slate-500 transition-transform duration-300 ml-1 hidden sm:block", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-52 rounded-2xl bg-[#050816] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] p-2 backdrop-blur-3xl overflow-hidden z-50"
              >
                <button 
                  onClick={() => { setIsProfileOpen(false); /* Assume passed prop for dispatching profile */ document.dispatchEvent(new CustomEvent('NAVIGATE_TAB', { detail: 'profile' })) }} 
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <User size={14} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">Profile Options</span>
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); document.dispatchEvent(new CustomEvent('NAVIGATE_TAB', { detail: 'settings' })) }} 
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <Settings size={14} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">System Prefs</span>
                </button>
                <div className="h-[1px] bg-white/10 my-2 mx-2" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group"
                >
                  <LogOut size={14} className="text-red-500/60 group-hover:text-red-500 transition-colors" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-red-500/60 group-hover:text-red-500 transition-colors">Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
