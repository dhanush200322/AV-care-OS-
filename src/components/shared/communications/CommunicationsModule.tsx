import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Send,
  Radio,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Search,
  Inbox,
  Archive,
  Bell,
  Siren,
  Filter,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import {
  CommTargetType,
  DEPARTMENTS,
  normalizePortalRole,
  notificationMatches,
  PortalAudience,
  resolveBroadcastTarget,
  useCommunicationStore,
} from '../../../store/communicationStore';
import { useCommunicationHub } from '../../../hooks/useCommunicationHub';
import {
  audienceBadgeClass,
  CommunicationAudienceIcon,
  deliveryStatusBadge,
  recipientLabel,
} from './CommunicationAudienceIcon';
import {
  CommunicationsTheme,
  CommunicationsVariant,
  officialWaveLabel,
  themeForVariant,
} from './communicationsTheme';

interface CommunicationsModuleProps {
  variant: CommunicationsVariant;
  theme?: CommunicationsTheme;
  onToast?: (type: 'success' | 'error' | 'info', msg: string) => void;
}

const INPUT =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none resize-none leading-relaxed';
const TEXTAREA = `${INPUT} py-3`;
const SELECT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none';

const ROLE_OPTIONS = [
  { value: 'doctor', label: 'Doctors' },
  { value: 'receptionist', label: 'Receptionists' },
  { value: 'security', label: 'Security Staff' },
  { value: 'ambulance', label: 'Ambulance Staff' },
  { value: 'admin', label: 'Admin Team' },
] as const;

function variantToPortalRole(variant: CommunicationsVariant): PortalAudience {
  if (variant === 'receptionist') return 'receptionist';
  return variant;
}

export const CommunicationsModule: React.FC<CommunicationsModuleProps> = ({
  variant,
  theme: themeProp,
  onToast,
}) => {
  const theme = themeProp ?? themeForVariant(variant);
  const { profile, user } = useAuth();
  const { portalRole, userId } = useCommunicationHub();

  const sendCommunication = useCommunicationStore((s) => s.sendCommunication);
  const getInbox = useCommunicationStore((s) => s.getInbox);
  const getSent = useCommunicationStore((s) => s.getSent);
  const getLogs = useCommunicationStore((s) => s.getLogs);
  const allNotifications = useCommunicationStore((s) => s.notifications);
  const allCommunications = useCommunicationStore((s) => s.communications);
  const markCommunicationRead = useCommunicationStore((s) => s.markCommunicationRead);
  const markNotificationRead = useCommunicationStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useCommunicationStore((s) => s.markAllNotificationsRead);
  const archiveCommunication = useCommunicationStore((s) => s.archiveCommunication);
  const searchCommunications = useCommunicationStore((s) => s.searchCommunications);
  const initFromStorage = useCommunicationStore((s) => s.initFromStorage);

  const effectiveRole = profile?.role ? normalizePortalRole(profile.role) ?? portalRole : variantToPortalRole(variant);
  const senderName = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Staff User';
  const senderRole = profile?.role ?? variant;

  const [composeMode, setComposeMode] = useState<'broadcast' | 'message'>('broadcast');
  const [feedTab, setFeedTab] = useState<'inbox' | 'sent' | 'logs' | 'notifications' | 'archive'>('inbox');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'broadcast' | 'direct' | 'emergency' | 'unread'>('all');

  const [bTitle, setBTitle] = useState('');
  const [bMessage, setBMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [targetType, setTargetType] = useState<CommTargetType>('all');
  const [targetRole, setTargetRole] = useState(effectiveRole === 'all' ? 'doctor' : effectiveRole);
  const [targetDepartment, setTargetDepartment] = useState<string>(DEPARTMENTS[0]);
  const [targetUserQuery, setTargetUserQuery] = useState('');
  const [targetUserName, setTargetUserName] = useState('');

  const [msgTitle, setMsgTitle] = useState('');
  const [msgContent, setMsgContent] = useState('');

  const inbox = useMemo(() => getInbox(effectiveRole, user?.id), [getInbox, effectiveRole, user?.id, isRefreshing]);
  const sent = useMemo(() => getSent(user?.id), [getSent, user?.id, isRefreshing]);
  const logs = useMemo(
    () => getLogs(effectiveRole, user?.id, true),
    [getLogs, effectiveRole, user?.id, allCommunications, isRefreshing]
  );
  const notifications = useMemo(
    () =>
      allNotifications
        .filter((n) => notificationMatches(n, effectiveRole, user?.id))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [allNotifications, effectiveRole, user?.id, isRefreshing]
  );
  const unread = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  const archived = useMemo(
    () =>
      allCommunications.filter(
        (c) => c.archived && matchesArchiveView(c, effectiveRole, user?.id, true)
      ),
    [allCommunications, effectiveRole, user?.id, isRefreshing]
  );

  const waveLabel = officialWaveLabel(variant);

  const handleRefresh = () => {
    setIsRefreshing(true);
    initFromStorage();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim() || !bMessage.trim()) return;

    const target = resolveBroadcastTarget({
      targetType,
      targetRole,
      targetDepartment,
      targetUserQuery,
      targetUserName,
    });

    await sendCommunication({
      title: bTitle.trim(),
      message: bMessage.trim(),
      ...target,
      priority: isEmergency ? 'emergency' : 'announcement',
      isEmergency,
      senderName,
      senderRole,
      senderId: user?.id,
    });

    onToast?.('success', isEmergency ? 'Emergency broadcast transmitted' : 'Broadcast transmitted');
    setBTitle('');
    setBMessage('');
    setIsEmergency(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgContent.trim()) return;

    await sendCommunication({
      title: msgTitle.trim() || 'Direct Message',
      message: msgContent.trim(),
      targetType: 'user',
      targetUserName: targetUserName.trim() || 'Staff Member',
      targetUserId: targetUserQuery.trim() || undefined,
      priority: 'direct',
      senderName,
      senderRole,
      senderId: user?.id,
    });

    onToast?.('success', 'Message sent');
    setMsgTitle('');
    setMsgContent('');
  };

  const feedItems = useMemo(() => {
    let list = inbox;
    if (feedTab === 'sent') list = sent;
    if (feedTab === 'logs') list = logs;
    if (feedTab === 'archive') list = archived;
    if (feedTab === 'notifications') return [];
    if (searchQuery || filter !== 'all') {
      list = searchCommunications(effectiveRole, searchQuery, filter).filter((c) =>
        feedTab === 'sent' ? c.senderId === user?.id : feedTab === 'logs' ? true : !c.archived
      );
    } else if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.message.toLowerCase().includes(q) ||
          c.senderName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [feedTab, inbox, sent, logs, archived, searchQuery, filter, searchCommunications, effectiveRole, user?.id]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <Inbox size={14} className="text-white/50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Inbox</span>
          <span className="text-xs font-black text-white">{inbox.length}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <Bell size={14} className="text-white/50" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Unread</span>
          <span className="text-xs font-black text-emerald-400">{unread}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[550px] items-stretch">
        <div className={cn('border rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden', theme.composePanel)}>
          <div>
            <div className="mb-4">
              <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">
                {variant === 'admin' ? 'Admin Broadcast Center' : 'Broadcast Center'}
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                Target all staff, roles, departments, or individuals
              </p>
            </div>

            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => setComposeMode('broadcast')}
                className={cn(
                  'py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5',
                  composeMode === 'broadcast' ? theme.broadcastActive : theme.broadcastInactive
                )}
              >
                <Radio size={12} className={cn(composeMode === 'broadcast' && 'animate-pulse')} />
                Broadcast
              </button>
              <button
                type="button"
                onClick={() => setComposeMode('message')}
                className={cn(
                  'py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5',
                  composeMode === 'message' ? theme.messageActive : theme.messageInactive
                )}
              >
                <MessageSquare size={12} />
                Message
              </button>
            </div>

            {composeMode === 'broadcast' ? (
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Broadcast Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SYSTEM PROTOCOL UPGRADED..."
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                    className={cn(INPUT, theme.inputFocus)}
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Broadcast To
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as CommTargetType)}
                    className={cn(SELECT, theme.inputFocus)}
                  >
                    <option className="bg-slate-950 text-white" value="all">
                      All Staff
                    </option>
                    <option className="bg-slate-950 text-white" value="role">
                      Specific Role
                    </option>
                    <option className="bg-slate-950 text-white" value="department">
                      Department
                    </option>
                    <option className="bg-slate-950 text-white" value="user">
                      Individual User
                    </option>
                  </select>
                </div>

                {targetType === 'role' && (
                  <div>
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                      Target Role
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className={cn(SELECT, theme.inputFocus)}
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} className="bg-slate-950 text-white" value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === 'department' && (
                  <div>
                    <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                      Target Department
                    </label>
                    <select
                      value={targetDepartment}
                      onChange={(e) => setTargetDepartment(e.target.value)}
                      className={cn(SELECT, theme.inputFocus)}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} className="bg-slate-950 text-white" value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === 'user' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                        Search User (ID or name)
                      </label>
                      <input
                        type="text"
                        value={targetUserQuery}
                        onChange={(e) => setTargetUserQuery(e.target.value)}
                        placeholder="User ID or email prefix..."
                        className={cn(INPUT, theme.inputFocus)}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={targetUserName}
                        onChange={(e) => setTargetUserName(e.target.value)}
                        placeholder="Recipient display name"
                        className={cn(INPUT, theme.inputFocus)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Official Alert Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={bMessage}
                    onChange={(e) => setBMessage(e.target.value)}
                    placeholder="Type official emergency response instructions, server notifications or staff guidance..."
                    className={cn(TEXTAREA, theme.inputFocus)}
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-[#FF4444]/30 bg-[#FF4444]/10">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="rounded"
                  />
                  <Siren size={14} className="text-[#FF4444]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4444]">
                    Emergency Broadcast Mode
                  </span>
                </label>

                <button
                  type="submit"
                  className={cn(
                    'w-full py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2',
                    isEmergency ? 'bg-[#FF4444] hover:bg-[#FF5555] shadow-lg shadow-red-900/30' : theme.broadcastSubmit
                  )}
                >
                  <Radio size={14} className="animate-pulse" />{' '}
                  {isEmergency ? 'Transmit Emergency Alert' : 'Transmit Broadcast'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Message Title
                  </label>
                  <input
                    type="text"
                    value={msgTitle}
                    onChange={(e) => setMsgTitle(e.target.value)}
                    placeholder="Subject line..."
                    className={cn(INPUT, theme.inputFocus)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={targetUserName}
                    onChange={(e) => setTargetUserName(e.target.value)}
                    placeholder="Recipient name"
                    className={cn(INPUT, theme.inputFocus)}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                    Comm Content
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    placeholder="Type message status updates or direct communication..."
                    className={cn(TEXTAREA, theme.inputFocus)}
                  />
                </div>
                <button
                  type="submit"
                  className={cn(
                    'w-full py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2',
                    theme.messageSubmit
                  )}
                >
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-6 border-t border-white/5 pt-4">
            <ShieldAlert size={12} className={theme.footerIcon} /> SSL Core Wave Unified Tunnel
          </div>
        </div>

        <div className={cn('lg:col-span-2 border rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl', theme.feedPanel)}>
          <div className="p-4 border-b border-white/5 flex flex-col gap-3 bg-white/[0.01]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full animate-pulse', theme.feedDot)} />
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  Communication Center
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors self-end sm:self-auto"
              >
                <RefreshCw size={14} className={cn(isRefreshing && 'animate-spin')} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1 border border-white/10 rounded-xl p-0.5 bg-black/40">
              {(
                [
                  ['inbox', 'Inbox', Inbox],
                  ['sent', 'Sent', Send],
                  ['logs', 'Logs', Radio],
                  ['notifications', 'Alerts', Bell],
                  ['archive', 'Archive', Archive],
                ] as const
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFeedTab(id)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-1',
                    feedTab === id ? theme.feedBroadcastTab : theme.feedBroadcastTabInactive
                  )}
                >
                  <Icon size={10} /> {label}
                </button>
              ))}
            </div>

            {feedTab === 'notifications' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead(effectiveRole, user?.id)}
                  className="text-[10px] font-bold text-cyan-400 hover:underline uppercase tracking-widest"
                >
                  Mark all read
                </button>
              </div>
            )}

            {feedTab !== 'notifications' && (
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[140px] relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Filter size={12} className="text-white/30" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="px-2 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white"
                  >
                    <option value="all">All</option>
                    <option value="broadcast">Broadcasts</option>
                    <option value="direct">Direct</option>
                    <option value="emergency">Emergency</option>
                    <option value="unread">Unread</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar max-h-[500px]">
            <AnimatePresence mode="popLayout">
              {feedTab === 'notifications'
                ? notifications.map((n, i) => (
                    <motion.button
                      key={n.id}
                      type="button"
                      onClick={() => markNotificationRead(n.id)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border transition-all flex gap-3',
                        n.isRead ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.04] border-white/10'
                      )}
                    >
                      <Bell size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white uppercase">{n.title}</p>
                        <p className="text-xs text-white/60 mt-1">{n.message}</p>
                        <p className="text-[9px] text-white/30 mt-2 font-mono">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </motion.button>
                  ))
                : feedItems.map((c, i) => (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-4 hover:bg-white/[0.04] group relative overflow-hidden"
                    >
                      <div className="absolute right-4 top-4 text-[8px] font-mono text-white/15">
                        {new Date(c.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <CommunicationAudienceIcon targetType={c.targetType} targetRole={c.targetRole} />
                      <div className="flex-1 min-w-0 pr-16">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={audienceBadgeClass(c.targetRole ?? c.targetType)}>
                            {recipientLabel(c.targetType, c.targetRole, c.targetDepartment, c.targetUserName)}
                          </span>
                          <span className={deliveryStatusBadge(c.deliveryStatus)}>{c.deliveryStatus}</span>
                          <div className={cn('flex items-center gap-1 text-[8px] font-black uppercase tracking-widest', theme.officialWaveClass)}>
                            <Sparkles size={10} className={theme.officialWaveIcon} /> {waveLabel}
                          </div>
                        </div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">
                          From: {c.senderName} · {c.senderRole}
                        </p>
                        <span className="text-xs font-black text-white tracking-wide uppercase block mb-1.5">
                          {c.title}
                        </span>
                        <p className="text-xs text-white/70 font-semibold leading-relaxed">{c.message}</p>
                        <div className="flex gap-2 mt-3">
                          {c.deliveryStatus !== 'read' && (
                            <button
                              type="button"
                              onClick={() => markCommunicationRead(c.id, user?.id)}
                              className="text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:underline"
                            >
                              Mark Read
                            </button>
                          )}
                          {!c.archived && (
                            <button
                              type="button"
                              onClick={() => archiveCommunication(c.id)}
                              className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </AnimatePresence>

            {feedTab === 'notifications' && notifications.length === 0 && (
              <EmptyState icon={Bell} label="No notifications yet" />
            )}
            {feedTab !== 'notifications' && feedItems.length === 0 && (
              <EmptyState icon={feedTab === 'archive' ? Archive : Radio} label="No communications in this view" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function matchesArchiveView(
  c: { archived?: boolean; targetType: CommTargetType; targetRole?: string; targetUserId?: string; senderId?: string },
  portalRole: PortalAudience,
  userId?: string,
  isAdmin?: boolean
) {
  if (!c.archived) return false;
  if (isAdmin) return true;
  if (c.senderId && userId && c.senderId === userId) return true;
  if (c.targetType === 'all') return true;
  if (c.targetType === 'user') return !!userId && c.targetUserId === userId;
  if (c.targetType === 'role' && c.targetRole) {
    const t = normalizePortalRole(c.targetRole);
    return t === 'all' || t === portalRole;
  }
  return true;
}

const EmptyState: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; label: string }> = ({
  icon: Icon,
  label,
}) => (
  <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3 py-24 text-center">
    <Icon size={40} className="text-white" />
    <p className="text-xs font-black uppercase tracking-widest">{label}</p>
  </div>
);
