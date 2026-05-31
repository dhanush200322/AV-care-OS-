import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Siren, X } from 'lucide-react';
import { useCommunicationStore } from '../../../store/communicationStore';

export const EmergencyBroadcastBanner: React.FC<{ accent?: string }> = ({ accent = '#FF4444' }) => {
  const emergencyBanner = useCommunicationStore((s) => s.emergencyBanner);
  const clearEmergencyBanner = useCommunicationStore((s) => s.clearEmergencyBanner);

  return (
    <AnimatePresence>
      {emergencyBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
          <div
            className="max-w-lg w-full rounded-3xl border-2 p-8 text-center shadow-2xl"
            style={{ borderColor: accent, backgroundColor: `${accent}22` }}
          >
            <Siren size={48} className="mx-auto mb-4 animate-pulse" style={{ color: accent }} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2" style={{ color: accent }}>
              Emergency Broadcast
            </p>
            <h2 className="text-xl font-black text-white uppercase mb-3">{emergencyBanner.title}</h2>
            <p className="text-sm text-white/90 leading-relaxed mb-6">{emergencyBanner.message}</p>
            <button
              type="button"
              onClick={clearEmergencyBanner}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white"
              style={{ backgroundColor: accent }}
            >
              <X size={14} /> Acknowledge Alert
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
