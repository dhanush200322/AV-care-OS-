
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  SearchIcon,
  Command,
  ChevronDown,
  Globe,
  Sparkles,
  Info,
  AlertCircle
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
  const { notifications, clearAllNotifications, markNotificationAsRead } = useStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 px-8 py-4 flex items-center justify-between",
      scrolled ? "bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      {/* Search Trigger */}
      <div 
        onClick={onSearchClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-500 hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer group w-full max-w-md"
      >
        <Search size={18} className="group-hover:text-purple-400 transition-colors" />
        <span className="text-sm font-medium tracking-wide flex-1 italic text-white/20">Ctrl + K to search system...</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[10px]">
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Language Placeholder */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold tracking-widest text-slate-400">
          <Globe size={12} />
          <span>EN / தமிழ்</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNoteOpen(!isNoteOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all relative group"
          >
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-slate-950 text-[8px] font-black flex items-center justify-center text-white">
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
                className="absolute right-0 mt-4 w-80 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-4 backdrop-blur-3xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                  <h3 className="text-xs font-black tracking-widest uppercase text-white/40">Communications</h3>
                  <span 
                    onClick={clearAllNotifications}
                    className="text-[10px] text-purple-400 font-bold hover:underline cursor-pointer"
                  >
                    Clear All
                  </span>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={cn(
                        "flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group relative",
                        !notif.read && "bg-white/[0.02]"
                      )}
                    >
                      {!notif.read && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-purple-500" />}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border border-white/20",
                        notif.type === 'emergency' ? 'bg-red-500/20 text-red-500' : 
                        notif.type === 'broadcast' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}>
                        {notif.type === 'emergency' ? <AlertCircle size={14} /> : 
                         notif.type === 'broadcast' ? <Sparkles size={14} /> : <Info size={14} />}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "text-[11px] leading-tight mb-1",
                          notif.read ? "text-slate-400" : "text-white font-semibold"
                        )}>
                          {notif.message}
                        </p>
                        <p className="text-[9px] text-slate-500">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 opacity-20">
                      <Bell size={24} className="mx-auto mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No Notifications</p>
                    </div>
                  )}
                </div>
                <button className="w-full mt-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-purple-500/20 transition-colors">
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
            className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border border-white/20 shadow-lg">
              <User size={18} className="text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-white leading-none mb-0.5">ADMIN CORE</p>
              <p className="text-[9px] text-slate-500 tracking-tighter">ro224313@gmail.com</p>
            </div>
            <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-300", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-2 backdrop-blur-3xl overflow-hidden"
              >
                {[
                  { label: 'Profile', icon: User, color: 'text-slate-400' },
                  { label: 'Settings', icon: Settings, color: 'text-slate-400' },
                ].map((item) => (
                  <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                    <item.icon size={16} className={item.color} />
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                  </button>
                ))}
                <div className="h-[1px] bg-white/5 my-2" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group"
                >
                  <LogOut size={16} className="text-red-500/60 group-hover:text-red-500 transition-colors" />
                  <span className="text-xs font-bold text-red-500/60 group-hover:text-red-500 transition-colors">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
