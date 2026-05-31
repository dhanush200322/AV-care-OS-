import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Radio, UserCircle2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { cn } from '../../../lib/utils';
import {
  audienceFilterForVariant,
  CommunicationsTheme,
  CommunicationsVariant,
  defaultAudienceForVariant,
  officialWaveLabel,
  themeForVariant,
} from './communicationsTheme';

interface CommunicationsModuleProps {
  variant: CommunicationsVariant;
  theme?: CommunicationsTheme;
}

const INPUT =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none resize-none leading-relaxed';
const TEXTAREA = `${INPUT} py-3`;
const SELECT = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none';

export const CommunicationsModule: React.FC<CommunicationsModuleProps> = ({
  variant,
  theme: themeProp,
}) => {
  const theme = themeProp ?? themeForVariant(variant);
  const { messages, broadcasts, addMessage, addBroadcast, refreshAllData } = useStore();

  const [composeMode, setComposeMode] = useState<'broadcast' | 'message'>('broadcast');
  const [feedMode, setFeedMode] = useState<'broadcast' | 'message'>('broadcast');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [bTitle, setBTitle] = useState('');
  const [bAudience, setBAudience] = useState(defaultAudienceForVariant(variant));
  const [bMessage, setBMessage] = useState('');

  const [msgContent, setMsgContent] = useState('');
  const [selectedSender, setSelectedSender] = useState<'Nurse Emily' | 'Dr. Satish Nair' | 'Michael Chang'>('Nurse Emily');

  const visibleBroadcasts = useMemo(
    () => broadcasts.filter(audienceFilterForVariant(variant)),
    [broadcasts, variant]
  );

  const waveLabel = officialWaveLabel(variant);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim() || !bMessage.trim()) return;
    addBroadcast({ title: bTitle, message: bMessage, audience: bAudience });
    setBTitle('');
    setBMessage('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgContent.trim()) return;
    const senderRole =
      selectedSender === 'Dr. Satish Nair'
        ? 'Neurologist'
        : selectedSender === 'Michael Chang'
          ? 'Security Lead'
          : 'Ward 4B';
    addMessage({ sender: selectedSender, role: senderRole, content: msgContent });
    setMsgContent('');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshAllData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const audienceBadge = (audience: string) => {
    const base = 'px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border';
    if (audience === 'all') return cn(base, 'bg-purple-500/20 text-purple-300 border-purple-500/20');
    if (audience === 'doctor') return cn(base, 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20');
    if (audience === 'reception') return cn(base, 'bg-teal-500/20 text-teal-300 border-teal-500/20');
    if (audience === 'security') return cn(base, 'bg-blue-500/20 text-blue-300 border-blue-500/20');
    return cn(base, 'bg-orange-500/20 text-orange-300 border-orange-500/20');
  };

  const audienceIconBox = (audience: string) => {
    const base = 'w-11 h-11 rounded-xl flex items-center justify-center border text-white flex-shrink-0';
    if (audience === 'all') return cn(base, 'bg-purple-500/10 border-purple-500/20 text-purple-400');
    if (audience === 'doctor') return cn(base, 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400');
    if (audience === 'reception') return cn(base, 'bg-teal-500/10 border-teal-500/20 text-teal-400');
    if (audience === 'security') return cn(base, 'bg-blue-500/10 border-blue-500/20 text-blue-400');
    return cn(base, 'bg-orange-500/10 border-orange-500/20 text-orange-400');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[550px] items-stretch">
      <div
        className={cn(
          'border rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden',
          theme.composePanel
        )}
      >
        <div>
          <div className="mb-4">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Dispatch Center</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">
              Transmit critical waves or record feed logs
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
                  Target Station / Role
                </label>
                <select
                  value={bAudience}
                  onChange={(e) => setBAudience(e.target.value as typeof bAudience)}
                  className={cn(SELECT, theme.inputFocus)}
                >
                  <option className="bg-slate-950 text-white" value="all">
                    🌐 All Stations (Global Grid)
                  </option>
                  <option className="bg-slate-950 text-white" value="doctor">
                    👩‍⚕️ Doctor Dashboard (Clinical Staff)
                  </option>
                  <option className="bg-slate-950 text-white" value="reception">
                    🏢 Reception Dashboard (Admissions Desk)
                  </option>
                  <option className="bg-slate-950 text-white" value="security">
                    👮‍♂️ Security Dashboard (Facility Watch)
                  </option>
                  <option className="bg-slate-950 text-white" value="ambulance">
                    🚑 Ambulance Dashboard (EMS Crew)
                  </option>
                </select>
              </div>
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
              <button
                type="submit"
                className={cn(
                  'w-full py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2',
                  theme.broadcastSubmit
                )}
              >
                <Radio size={14} className="animate-pulse" /> Transmit Broadcast
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">
                  Sender Identity
                </label>
                <select
                  value={selectedSender}
                  onChange={(e) => setSelectedSender(e.target.value as typeof selectedSender)}
                  className={cn(SELECT, theme.inputFocus)}
                >
                  <option className="bg-slate-950 text-white" value="Nurse Emily">
                    👩‍⚕️ Nurse Emily (Ward 4B)
                  </option>
                  <option className="bg-slate-950 text-white" value="Dr. Satish Nair">
                    👨‍⚕️ Dr. Satish Nair (Neurology)
                  </option>
                  <option className="bg-slate-950 text-white" value="Michael Chang">
                    👮‍♂️ Michael Chang (Security Lead)
                  </option>
                </select>
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
                  placeholder="Type message status updates or chat records for clinical stream logs..."
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
                <Send size={14} /> Send Log Message
              </button>
            </form>
          )}
        </div>

        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-6 border-t border-white/5 pt-4">
          <ShieldAlert size={12} className={theme.footerIcon} /> SSL Core Wave Unified Tunnel
        </div>
      </div>

      <div
        className={cn(
          'lg:col-span-2 border rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl',
          theme.feedPanel
        )}
      >
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <span className={cn('w-2 h-2 rounded-full animate-pulse', theme.feedDot)} />
            <span className="text-xs font-black text-white uppercase tracking-widest">
              Global Communications Logs
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-white/10 rounded-xl p-0.5 bg-black/40">
              <button
                type="button"
                onClick={() => setFeedMode('broadcast')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                  feedMode === 'broadcast' ? theme.feedBroadcastTab : theme.feedBroadcastTabInactive
                )}
              >
                Broadcasts
              </button>
              <button
                type="button"
                onClick={() => setFeedMode('message')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                  feedMode === 'message' ? theme.feedMessageTab : theme.feedMessageTabInactive
                )}
              >
                Messages
              </button>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <RefreshCw size={14} className={cn(isRefreshing && 'animate-spin')} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar max-h-[500px]">
          <AnimatePresence mode="popLayout">
            {feedMode === 'broadcast'
              ? visibleBroadcasts.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-4 hover:bg-white/[0.04] group relative overflow-hidden"
                  >
                    <div className="absolute right-4 top-4 text-[8px] font-mono text-white/15">
                      {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {audienceIconBox(b.audience)}
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={audienceBadge(b.audience)}>
                          {b.audience === 'all' ? 'ALL STATIONS' : b.audience.toUpperCase()}
                        </span>
                        <div
                          className={cn(
                            'flex items-center gap-1 text-[8px] font-black uppercase tracking-widest',
                            theme.officialWaveClass
                          )}
                        >
                          <Sparkles size={10} className={theme.officialWaveIcon} /> {waveLabel}
                        </div>
                      </div>
                      <span className="text-xs font-black text-white tracking-wide uppercase block mb-1.5">
                        {b.title}
                      </span>
                      <p className="text-xs text-white/70 font-semibold leading-relaxed">{b.message}</p>
                    </div>
                  </motion.div>
                ))
              : messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-4 hover:bg-white/[0.04] group relative overflow-hidden"
                  >
                    <div className="absolute right-4 top-4 text-[8px] font-mono text-white/15">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/10 via-transparent to-white/5 flex items-center justify-center border border-white/10 text-white flex-shrink-0">
                      <UserCircle2 size={18} className="text-slate-200" />
                    </div>
                    <div className="flex-1 min-w-0 pr-12">
                      <div>
                        <span className="text-xs font-black text-white lowercase tracking-wider">{msg.sender}</span>
                        <span className="text-[9px] font-bold text-cyan-400 ml-2 uppercase tracking-widest">
                          {msg.role}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 font-semibold mt-2 leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>

          {feedMode === 'broadcast' && visibleBroadcasts.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3 py-24 text-center">
              <Radio size={40} className="text-white" />
              <p className="text-xs font-black uppercase tracking-widest">No Transmitted Waves Active</p>
            </div>
          )}

          {feedMode === 'message' && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-3 py-24 text-center">
              <MessageSquare size={40} className="text-white" />
              <p className="text-xs font-black uppercase tracking-widest">No Stream Logs Received</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
