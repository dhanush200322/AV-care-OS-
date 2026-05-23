import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuth } from '../contexts/AuthContext';

export const SaaSLimitModal: React.FC = () => {
  const { isLimitModalOpen, limitModalTitle, limitModalMessage, setIsLimitModalOpen, setPlan } = useStore();
  const { updatePlan } = useAuth();
  const [upgrading, setUpgrading] = React.useState(false);
  const [upgraded, setUpgraded] = React.useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      if (updatePlan) {
        await updatePlan('pro');
      }
      setPlan('pro');
      setUpgraded(true);
      setTimeout(() => {
        setIsLimitModalOpen(false);
        setUpgraded(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      {isLimitModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="w-full max-w-lg bg-[#0e1327] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] relative"
          >
            {/* Top glowing bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500" />
            
            <div className="p-8 text-left">
              {/* Icon & Decorative Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black font-mono tracking-[0.25em] text-cyan-400 uppercase">SYSTEM TRACE ATTAINED</h3>
                  <h2 className="text-xl font-bold text-white tracking-wide">{limitModalTitle || 'Free plan limit reached.'}</h2>
                </div>
              </div>

              {/* Message */}
              <p className="text-slate-300 text-sm tracking-wide mb-8 leading-relaxed">
                {limitModalMessage || 'Your system profile has reached its maximum sandbox registry vectors under the free tier. Upgrade to the enterprise configuration for absolute limitless clinical operations.'}
              </p>

              {/* Bento Feature Comparison inside the alert */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Free Sandbox</h4>
                  <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                    <li className="flex items-center gap-1.5 text-slate-500 line-through">
                      <span>• Full Telemetry Logs</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>• Patients: Max 5</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span>• AI Queries: Max 3</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/10">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">Pro Operational</h4>
                  <ul className="space-y-1.5 text-xs text-cyan-300 font-mono">
                    <li className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓ Unlimited Records</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓ Absolute AI Co-pilot</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-emerald-400">
                      <span>✓ Unified Control Core</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsLimitModalOpen(false)}
                  disabled={upgrading || upgraded}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 border border-white/10 rounded-xl font-medium tracking-wide text-xs uppercase cursor-pointer transition-all active:scale-[0.98]"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={upgrading || upgraded}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-50 text-white font-black tracking-widest text-xs uppercase rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {upgraded ? (
                    <>
                      <Check className="w-4 h-4 text-white animate-bounce" />
                      <span>SECURE CORE ONLINE</span>
                    </>
                  ) : upgrading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full"
                      />
                      <span>SYNCHRONIZING...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
                      <span>Upgrade to Pro</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
