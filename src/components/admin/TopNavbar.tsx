
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Command,
  ChevronDown,
  Globe,
  Sparkles,
  Siren,
  Hospital,
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useTranslation } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { NotificationBellPanel } from '../shared/communications/NotificationBellPanel';
import { normalizePortalRole } from '../../store/communicationStore';

interface TopNavbarProps {
  onLogout: () => void;
  onSearchClick: () => void;
  onOpenCommunication?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onLogout, onSearchClick, onOpenCommunication }) => {
  const { theme, toggleTheme } = useTheme();
  const { profile, user } = useAuth();
  const portalRole = profile?.role ? normalizePortalRole(profile.role) ?? 'admin' : 'admin';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isEmergencyMode, toggleEmergencyMode, addNotification } = useStore();
  const { currentLanguage, setLanguage, languages, t } = useTranslation();

  const [selectedBranch, setSelectedBranch] = useState(() => {
    return localStorage.getItem('selected_branch') || 'Chennai HQ';
  });
  const [branches, setBranches] = useState<string[]>(() => {
    const saved = localStorage.getItem('hospital_branches');
    return saved ? JSON.parse(saved) : ['Chennai HQ', 'Mumbai Clinic', 'Delhi Emergency Center', 'Bengaluru Specialty'];
  });
  const [newBranchInput, setNewBranchInput] = useState('');

  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newBranchInput.trim();
    if (!cleanName) return;

    const exists = branches.some(b => b.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      addNotification({
        message: `⚠️ Branch "${cleanName}" already exists in the registry.`,
        type: 'system'
      });
      setNewBranchInput('');
      return;
    }

    const updated = [...branches, cleanName];
    setBranches(updated);
    localStorage.setItem('hospital_branches', JSON.stringify(updated));
    setSelectedBranch(cleanName);
    localStorage.setItem('selected_branch', cleanName);
    setNewBranchInput('');
    setIsBranchDropdownOpen(false);

    addNotification({
      message: `🏢 New active hospital branch registered: ${cleanName.toUpperCase()}`,
      type: 'system'
    });
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
    localStorage.setItem('selected_branch', branch);
    setIsBranchDropdownOpen(false);

    addNotification({
      message: `🔄 Switched active operating branch to: ${branch.toUpperCase()}`,
      type: 'system'
    });
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4",
      scrolled || isEmergencyMode ? "bg-[#050816]/80 backdrop-blur-3xl border-b py-3" : "bg-transparent",
      isEmergencyMode ? "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]" : "border-white/5"
    )}>
      {/* Branch & Language Selector (Left) */}
      <div className="flex flex-wrap items-center gap-4">
         {/* Premium Branch Dropdown with Ref */}
         <div className="relative" ref={branchDropdownRef}>
            <button 
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/90 hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-md select-none"
            >
               <Hospital size={13} className="text-purple-400" />
               <span className="max-w-[120px] truncate">{selectedBranch}</span>
               <ChevronDown size={11} className={cn("text-white/40 transition-transform duration-300", isBranchDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isBranchDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute left-0 mt-2.5 w-64 rounded-2xl bg-[#090d16] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] py-2.5 overflow-hidden z-50 backdrop-blur-3xl"
                >
                  <div className="px-3.5 pb-2 border-b border-white/5">
                    <span className="text-[8px] font-black text-white/35 uppercase tracking-widest block leading-none">{t('OS Operational Branches')}</span>
                  </div>
                  <div className="max-h-[180px] overflow-y-auto no-scrollbar py-1">
                    {branches.map((b) => (
                      <button
                        key={b}
                        onClick={() => handleSelectBranch(b)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/5",
                          b === selectedBranch ? "text-purple-400 bg-purple-500/5 font-black" : "text-white/60 hover:text-white"
                        )}
                      >
                        <span className="truncate pr-2">{b}</span>
                        {b === selectedBranch && (
                          <div className="w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,1)]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Add Branch Form inline */}
                  <div className="border-t border-white/5 pt-2.5 px-3 bg-white/[0.01]">
                    <span className="text-[7.5px] font-black text-white/30 uppercase tracking-widest px-0.5 block mb-1.5">{t('Add New Operating Branch')}</span>
                    <form onSubmit={handleAddBranch} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder={t('Enter Branch...')}
                        value={newBranchInput}
                        onChange={(e) => setNewBranchInput(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-lg py-1 px-2 text-[9px] text-white uppercase tracking-wider focus:outline-none placeholder:text-white/10"
                      />
                      <button
                        type="submit"
                        className="p-1 px-2 text-[9px] font-black rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/20 hover:border-transparent transition-all duration-300 uppercase tracking-widest"
                      >
                        {t('Add')}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Premium Language Grid Dropdown */}
         <div className="relative" ref={langDropdownRef}>
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/90 hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-md select-none"
            >
               <Globe size={13} className="text-cyan-400 animate-pulse" />
               <span>{currentLanguage}</span>
               <ChevronDown size={11} className={cn("text-white/40 transition-transform duration-300", isLangDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute left-0 mt-2.5 w-[310px] md:w-[330px] rounded-2xl bg-[#090d16] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-3 z-50 backdrop-blur-3xl"
                >
                  <div className="pb-2.5 mb-2.5 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-white/35 uppercase tracking-widest block leading-none">{t('OS Language Selection')}</span>
                    <span className="text-[7.5px] font-bold text-cyan-400/80 bg-cyan-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{t('Language Selected')}: {currentLanguage}</span>
                  </div>

                  {/* 3 Column Grid showing all languages simultaneously */}
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangDropdownOpen(false);
                            addNotification({
                              message: `🌐 Language updated to: ${lang.name} (${lang.nativeName})`,
                              type: 'system'
                            });
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center select-none cursor-pointer group",
                            isSelected 
                              ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300 font-extrabold shadow-[0_0_12px_rgba(34,211,238,0.1)]" 
                              : "bg-white/[0.01] border-white/5 text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20"
                          )}
                        >
                          <span className="text-base mb-1 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] group-hover:scale-110 transition-transform">{lang.flag}</span>
                          <span className="text-[9px] font-black uppercase tracking-wider block">{lang.code}</span>
                          <span className="text-[7px] opacity-40 uppercase tracking-tighter truncate w-full group-hover:opacity-80 transition-opacity mt-0.5">{lang.nativeName}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
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
          {isEmergencyMode ? t('SYSTEM IN LOCKDOWN') : t('Ask AI, search patients, audit logs...')}
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
             {isEmergencyMode ? t('SLA BREACH ACTIVE') : t('EMERGENCY')}
           </span>
        </button>

        <NotificationBellPanel
          portalRole={portalRole}
          userId={user?.id}
          accentClass="text-purple-400"
          badgeClass="bg-purple-500"
          onOpenCommunication={onOpenCommunication}
        />

        {/* Premium Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle structural light/dark system mode"
          className={cn(
            "relative w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-white/5 border border-white/10 hover:border-purple-400/40 select-none group focus:outline-none overflow-hidden cursor-pointer",
            theme === 'light' 
              ? "shadow-[inset_0_1px_3px_rgba(15,23,42,0.06),0_0_15px_rgba(168,85,247,0.1)] border-purple-400/20 text-purple-600 bg-white" 
              : "shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_0_15px_rgba(34,211,238,0.15)] border-white/10 text-cyan-400"
          )}
        >
          {/* Neon Glow Hover Ring Effect */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
          )} />
          
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="dark-icon"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex items-center justify-center"
              >
                <Moon size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </motion.div>
            ) : (
              <motion.div
                key="light-icon"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex items-center justify-center"
              >
                <Sun size={16} className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Physical status neon micro LED dot */}
          <span className={cn(
            "absolute bottom-1 right-1 w-1 h-1 rounded-full transition-all duration-300",
            theme === 'dark' ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]" : "bg-purple-500 shadow-[0_0_6px_#a855f7]"
          )} />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <User size={16} className="text-white" />
              </div>
            )}
            <div className="text-left hidden lg:block">
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-0.5">{profile?.full_name || t('Admin')}</p>
              <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-tighter">{t('Hospital OS')}</p>
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
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">{t('Profile Options')}</span>
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); document.dispatchEvent(new CustomEvent('NAVIGATE_TAB', { detail: 'settings' })) }} 
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <Settings size={14} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">{t('System Prefs')}</span>
                </button>
                <div className="h-[1px] bg-white/10 my-2 mx-2" />
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group"
                >
                  <LogOut size={14} className="text-red-500/60 group-hover:text-red-500 transition-colors" />
                  <span className="text-[11px] font-black tracking-widest uppercase text-red-500/60 group-hover:text-red-500 transition-colors">{t('Log Out')}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
