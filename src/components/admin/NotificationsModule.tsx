import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Siren, Sparkles, Trash2, ShieldAlert, CheckSquare, ListFilter, AlertTriangle, MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const NotificationsModule: React.FC = () => {
  const { notifications, clearAllNotifications, markNotificationAsRead } = useStore();
  const [filter, setFilter] = useState<'all' | 'broadcast' | 'system' | 'emergency'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
        <div className="flex items-center gap-2">
          <ListFilter size={16} className="text-purple-400" />
          <span className="text-xs font-black uppercase tracking-widest text-white/50">Filter Logs</span>
          <div className="flex flex-wrap gap-1 ml-2">
            {(['all', 'broadcast', 'system', 'emergency'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                  filter === f 
                    ? "bg-purple-500 text-white shadow"
                    : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={clearAllNotifications}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 active:scale-95 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
        >
          <Trash2 size={12} /> Clear Registry
        </button>
      </div>

      <div className="max-w-4xl bg-slate-900/40 border border-white/5 rounded-[32px] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
          <span className="text-[10px] font-black tracking-widest uppercase text-white/30">Facility Telemetry List</span>
        </div>
        <div className="divide-y divide-white/5 min-h-[150px]">
          <AnimatePresence initial={false}>
            {filteredNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => markNotificationAsRead(n.id)}
                className={cn(
                  "p-5 flex gap-4 items-start hover:bg-white/[0.02] cursor-pointer transition-colors relative group",
                  !n.read && "bg-cyan-500/[0.01]"
                )}
              >
                {!n.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-cyan-400 rounded-r" />
                )}

                <div className={cn(
                  "p-2.5 rounded-xl border flex-shrink-0",
                  n.type === 'emergency' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  n.type === 'broadcast' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                )}>
                  {n.type === 'emergency' ? <Siren size={16} /> :
                   n.type === 'broadcast' ? <Sparkles size={16} /> : <AlertTriangle size={16} />}
                </div>

                <div className="flex-1">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-white/20 uppercase">REC: {n.id}</span>
                      <span className="text-[9px] font-bold text-white/30">{new Date(n.createdAt).toLocaleString()}</span>
                   </div>
                   <p className={cn("text-xs leading-relaxed", n.read ? "text-white/60 font-semibold" : "text-white font-black")}>
                     {n.message}
                   </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center opacity-30 gap-3">
               <Bell size={36} />
               <p className="text-xs font-black uppercase tracking-widest">No Alerts in registry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
