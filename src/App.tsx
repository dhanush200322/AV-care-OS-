import React, { useState } from 'react';
import { Background } from './components/Background';
import { Carousel } from './components/Carousel';
import { EnterButton } from './components/EnterButton';
import { LoginView } from './components/LoginView';
import { Role, ROLES, ViewMode } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Power } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[1]); // Default to Doctor
  const [hoveredRole, setHoveredRole] = useState<Role | null>(null);
  const [rememberRole, setRememberRole] = useState(false);

  // Determine the background role (hover has preference for preview effect)
  const backgroundRole = hoveredRole || selectedRole;

  const handleEnter = () => {
    setViewMode('auth');
  };

  const handleBack = () => {
    setViewMode('selection');
  };

  return (
    <div id="app-root" className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden text-slate-100 font-sans bg-slate-950">
      <Background selectedRole={backgroundRole} isPreview={!!hoveredRole && viewMode === 'selection'} />

      <AnimatePresence mode="wait">
        {viewMode === 'selection' ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between"
          >
            {/* Header Section */}
            <header id="app-header" className="relative z-10 w-full pt-16 text-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center gap-2"
              >
                <h1 
                  className="text-white text-5xl md:text-7xl font-extralight tracking-[0.4em] mb-2"
                  style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}
                >
                  AV CARE OS
                </h1>
                <p className="text-cyan-400/50 text-[10px] md:text-xs uppercase tracking-[0.6em] font-medium">
                  Intelligent Hospital Operating System
                </p>
              </motion.div>
            </header>

            {/* Main Interactive Carousel */}
            <main id="app-main" className="relative z-10 w-full flex-1 flex items-center justify-center">
              <Carousel 
                onRoleSelect={setSelectedRole} 
                onRoleHover={setHoveredRole} 
              />
            </main>

            {/* Footer Section */}
            <footer id="app-footer" className="relative z-10 w-full pb-16 px-6 flex flex-col items-center gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center gap-8"
              >
                {/* Remember Toggle */}
                <div 
                  id="remember-toggle"
                  className="flex items-center gap-3 cursor-pointer group select-none"
                  onClick={() => setRememberRole(!rememberRole)}
                >
                  <div 
                    className={`w-10 h-5 rounded-full border transition-all duration-300 relative ${rememberRole ? 'bg-cyan-500/20 border-cyan-500' : 'bg-slate-900 border-white/20'}`}
                  >
                    <motion.div 
                      animate={{ x: rememberRole ? 20 : 0 }}
                      className={`absolute inset-y-[2px] left-[2px] w-4 h-4 rounded-full transition-colors ${rememberRole ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-500'}`}
                    />
                  </div>
                  <span className={`text-xs font-semibold tracking-widest uppercase transition-colors ${rememberRole ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    Remember selected role
                  </span>
                </div>

                {/* CTA Button */}
                <div onClick={handleEnter}>
                  <EnterButton selectedRole={selectedRole} />
                </div>

                {/* Bottom Branding / Info */}
                <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-8 w-64 opacity-40">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-400">
                    <Power size={12} className="text-cyan-400" />
                    <span>TERMINAL STATUS: READY</span>
                  </div>
                  <div className="text-[10px] text-slate-500">© 2026 AV CARE TECH SYSTEMS</div>
                </div>
              </motion.div>
            </footer>

            {/* Decorative HUD Elements */}
            <div className="fixed top-12 left-12 z-10 hidden lg:flex flex-col gap-4 opacity-30 font-mono text-[10px]">
              <div className="flex gap-2">
                <span className="text-cyan-400">[LATENCY]</span>
                <span className="text-white">0.042ms</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">[UPTIME]</span>
                <span className="text-white">99.98%</span>
              </div>
              <div className="flex gap-2">
                <span className="text-cyan-400">[SECURITY]</span>
                <span className="text-white">ENHANCED</span>
              </div>
            </div>

            <div className="fixed bottom-12 right-12 z-10 hidden lg:block opacity-30 font-mono text-[10px] text-right">
              <div className="text-cyan-400 mb-1">PROTO: V4.0.12</div>
              <div className="text-white">ENCRYPTED CONNECTION ESTABLISHED</div>
              <div className="w-32 h-[1px] bg-white/20 mt-2 ml-auto" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-screen"
          >
            <LoginView role={selectedRole} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
