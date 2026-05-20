
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  MessageSquare, 
  ChevronRight, 
  Search, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  SendHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Default closed in floating icon form, can be clicked to open
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string; actions?: any[] }[]>([
    { 
      role: 'ai', 
      content: "Protocol AI V12.4 Online. I have analyzed the branch data across all nodes. How can I optimize operations today?",
    }
  ]);
  const [confirmingAction, setConfirmingAction] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { birthdayPeople, sentWishes, wishingDashboards } = useStore();

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    
    const userQueryText = query;
    setMessages(prev => [...prev, { role: 'user', content: userQueryText }]);
    setQuery('');
    setActionSuccess(null);
    setLoading(true);

    const todayBirthdays = birthdayPeople.filter(p => p.month === 5 && p.day === 20);

    try {
      const systemPrompt = `You are Aegis Intelligence V12.4, the secure medical operational AI assistant for AV CARE Clinical OS. 
Answer with technical, crisp, authoritative clinical management insights. Keep it bulleted and professional in a purple cybernetic theme.
You are connected to the live medical graph API database. Here is the current live context:
- ACTIVE CELEBRANTS TODAY (May 20, 2026): ${JSON.stringify(todayBirthdays)}
- UPCOMING STAFF CELEBRANTS: ${JSON.stringify(birthdayPeople.filter(p => !(p.month === 5 && p.day === 20)))}
- DISPATCHED GREETING WISHES LOG: ${JSON.stringify(sentWishes)}
- MOUNTED VIRTUAL WISHES DASHBOARDS: ${JSON.stringify(wishingDashboards)}

Answer the user's operational query about clinical queues, SLA branches, revenue trends, or birthday wishes with extreme precision. Respond to user's questions properly.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userQueryText,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          systemInstruction: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status code ${response.status}`);
      }

      const data = await response.json();
      const aiAnswer = data.text || "No telemetry feedback received from Aegis.";

      // Create suitable quick actions dynamically if we identify key intents
      let actions: any[] = [];
      const contentLower = aiAnswer.toLowerCase();
      if (contentLower.includes('birthday') || contentLower.includes('celebrat') || contentLower.includes('wish')) {
        actions = [{ label: 'View Celebration Boards', type: 'normal', details: "Redirection to celebration dashboards." }];
      } else if (contentLower.includes('procure') || contentLower.includes('cost') || contentLower.includes('vendor')) {
        actions = [{ label: 'Audit Lab Vendors', type: 'critical', details: "Initiates full supply chain audit protocol." }];
      } else if (contentLower.includes('queue') || contentLower.includes('wait') || contentLower.includes('staff')) {
        actions = [{ label: 'Dispatch Float Staff', type: 'priority', details: "Assigns 2 idle physicians to queue." }];
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiAnswer, actions }]);
    } catch (err: any) {
      console.error("Gemini query failure in AI Assistant Chatbot:", err);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `AI NEURAL FAULT: Aegis stream interrupted (${err.message}). Reverting to live local graph simulation:\n\nChecking clinical databases... Today's celebrants list: ${todayBirthdays.length > 0 ? todayBirthdays.map(p => p.name).join(', ') : 'None today'}. A total of ${sentWishes.length} wishes are registered.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    // Execute
    setConfirmingAction(null);
    setActionSuccess(`ACTION DEPLOYED: ${confirmingAction.label.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const undoAction = () => {
    setActionSuccess("ACTION REVERTED.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] z-[60] hover:scale-110 active:scale-95 transition-all group"
      >
        <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-[#050816] border border-white/10 rounded-[32px] shadow-2xl z-[60] flex flex-col overflow-hidden backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Aegis Intelligence</p>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black uppercase text-white/30 tracking-widest leading-none">CORE V12.4</span>
                    </div>
                  </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                  <X size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
               {messages.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  )}>
                     <div className={cn(
                       "max-w-[85%] p-4 rounded-2xl text-xs uppercase font-medium leading-relaxed tracking-tight",
                       msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white/5 text-white/60 border border-white/5'
                     )}>
                        {msg.content}
                     </div>
                     {msg.actions && (
                        <div className="flex flex-wrap gap-2 mt-2">
                           {msg.actions.map((action: any) => (
                              <button 
                                key={action.label}
                                onClick={() => setConfirmingAction(action)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-1",
                                  action.type === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                                  action.type === 'priority' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' :
                                  'bg-purple-500/20 text-purple-400 border border-purple-500/20'
                                )}
                              >
                                {action.label} <ChevronRight size={10} />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
               {loading && (
                  <div className="flex flex-col gap-2 items-start animate-pulse">
                     <span className="text-[8px] font-black uppercase text-purple-400 tracking-widest font-mono">NEURAL PROCESSING GATE</span>
                     <div className="max-w-[85%] p-4 rounded-2xl text-xs bg-white/5 text-white/40 border border-white/5 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                       <span className="font-mono text-[9px] uppercase tracking-wider text-purple-300">Consulting Operations Graph...</span>
                     </div>
                  </div>
               )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/10 relative">
               
               <AnimatePresence>
                 {actionSuccess && (
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute bottom-[100%] left-6 right-6 mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-xl flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.2)] z-10"
                    >
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{actionSuccess}</span>
                       </div>
                       {actionSuccess !== "ACTION REVERTED." && (
                         <button onClick={undoAction} className="text-[9px] font-black text-white/50 hover:text-white uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/10 transition-colors">
                           Undo
                         </button>
                       )}
                    </motion.div>
                 )}
               </AnimatePresence>

               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask Aegis..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-900/40 hover:scale-110 active:scale-90 transition-all"
                  >
                    <SendHorizontal size={14} />
                  </button>
               </div>
               <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { label: 'SLA Breaches', icon: AlertTriangle },
                    { label: 'Revenue Trends', icon: TrendingUp },
                  ].map((p) => (
                    <button 
                      key={p.label}
                      onClick={() => setQuery(p.label)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-[8px] font-black uppercase text-white/30 tracking-widest hover:text-white hover:border-white/10 transition-all"
                    >
                      <p.icon size={10} />
                      {p.label}
                    </button>
                  ))}
               </div>
            </div>
            {/* Overlay Modal for Actions */}
            <AnimatePresence>
              {confirmingAction && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-[#050816]/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 border border-white/10"
                >
                  <ShieldCheck size={48} className="text-[#00E5FF] mb-4 opacity-80" />
                  <h3 className="text-sm font-black uppercase text-white tracking-[0.2em] mb-2 text-center">Confirm AI Action</h3>
                  <p className="text-xl font-black text-white text-center mb-2 leading-tight">{confirmingAction.label}</p>
                  <p className="text-[10px] text-white/50 text-center mb-8 px-4 leading-relaxed font-mono">{confirmingAction.details}</p>
                  
                  <div className="flex gap-4 w-full">
                     <button 
                       onClick={() => setConfirmingAction(null)}
                       className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleConfirmAction}
                       className="flex-1 py-3 bg-[#00E5FF] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#050816] hover:bg-[#00E5FF]/80 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
                     >
                       Authorize
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
