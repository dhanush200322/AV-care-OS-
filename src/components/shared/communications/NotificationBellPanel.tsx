import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertCircle, Info, Sparkles, Siren } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  CommNotification,
  CommPriority,
  PortalAudience,
  notificationMatches,
  useCommunicationStore,
} from '../../../store/communicationStore';

const priorityColor: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  emergency: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  announcement: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  information: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  system: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  department: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  direct: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  broadcast: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function NotifIcon({ type }: { type: CommNotification['type'] }) {
  if (type === 'emergency' || type === 'critical') return <Siren size={14} />;
  if (type === 'announcement' || type === 'broadcast') return <Sparkles size={14} />;
  if (type === 'system') return <AlertCircle size={14} />;
  return <Info size={14} />;
}

interface NotificationBellPanelProps {
  portalRole: PortalAudience;
  userId?: string;
  accentClass?: string;
  badgeClass?: string;
  onOpenCommunication?: () => void;
}

export const NotificationBellPanel: React.FC<NotificationBellPanelProps> = ({
  portalRole,
  userId,
  accentClass = 'text-cyan-400',
  badgeClass = 'bg-purple-500',
  onOpenCommunication,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | CommPriority>('all');

  const allNotifications = useCommunicationStore((s) => s.notifications);
  const markRead = useCommunicationStore((s) => s.markNotificationRead);
  const markAllRead = useCommunicationStore((s) => s.markAllNotificationsRead);

  const notifications = useMemo(
    () =>
      allNotifications
        .filter((n) => notificationMatches(n, portalRole, userId))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [allNotifications, portalRole, userId]
  );

  const unread = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const filtered =
    filter === 'all' ? notifications : notifications.filter((n) => n.type === filter);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className={accentClass} />
        {unread > 0 && (
          <span
            className={cn(
              'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center text-white border-2 border-[#050816]',
              badgeClass
            )}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-3xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Notifications</h3>
              <button
                type="button"
                onClick={() => markAllRead(portalRole, userId)}
                className="text-[10px] font-bold text-cyan-400 hover:underline"
              >
                Mark all read
              </button>
            </div>
            <div className="flex gap-1 p-2 border-b border-white/5 overflow-x-auto no-scrollbar">
              {(['all', 'critical', 'emergency', 'announcement', 'information'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-2 py-1 rounded-lg text-[8px] font-black uppercase whitespace-nowrap',
                    filter === f ? 'bg-white/10 text-white' : 'text-white/40'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="max-h-[320px] overflow-y-auto no-scrollbar p-2 space-y-1">
              {filtered.length === 0 ? (
                <p className="text-center py-8 text-[10px] text-white/30 uppercase tracking-widest">
                  No notifications
                </p>
              ) : (
                filtered.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      markRead(n.id);
                      onOpenCommunication?.();
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full text-left flex gap-3 p-2.5 rounded-xl transition-colors border border-transparent',
                      !n.isRead ? 'bg-white/[0.04] border-white/5' : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border',
                        priorityColor[n.type] ?? priorityColor.information
                      )}
                    >
                      <NotifIcon type={n.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-[11px] font-bold truncate', n.isRead ? 'text-white/50' : 'text-white')}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-white/50 line-clamp-2">{n.message}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
