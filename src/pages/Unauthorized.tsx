import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ChevronLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-6 font-sans selection:bg-red-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[48px] p-12 text-center shadow-2xl overflow-hidden relative group">
          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-px bg-red-500/20 z-0 pointer-events-none"
          />

          <div className="relative z-10 space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 animate-pulse" />
                <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 relative">
                  <ShieldAlert size={48} className="animate-bounce" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Access <span className="text-red-500">Denied</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-px w-8 bg-red-500/30" />
                 <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-400">Security Clearance Insufficient</p>
                 <div className="h-px w-8 bg-red-500/30" />
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto uppercase tracking-widest font-light">
                Neural profile mismatch detected. Your current authentication level does not permit access to this sector of the AV CareOS grid.
              </p>
            </div>

            <div className="pt-8 flex flex-col items-center gap-4">
               <button 
                 onClick={() => navigate('/')}
                 className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95"
               >
                 <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                 <span className="text-xs font-black uppercase tracking-widest">Return to Perimeter</span>
               </button>
               
               <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-white/10 mt-8">
                  <Lock size={10} />
                  <span>Protocol 99 Active • Unified Security Protocol</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;
