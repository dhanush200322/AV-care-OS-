import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mic, SendHorizontal, Eye } from 'lucide-react';
import { cn } from '../../lib/utils';
import { glassPanel } from './theme';

export const SecurityAIAssistant: React.FC<{ forceOpen?: boolean; onForceOpenChange?: (o: boolean) => void }> = ({ forceOpen, onForceOpenChange }) => {
  const [internal, setInternal] = useState(false);
  const open = forceOpen ?? internal;
  const setOpen = (v: boolean) => { setInternal(v); onForceOpenChange?.(v); };
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: 'Surveillance AI online. Threat analysis, visitor lookup, CCTV anomaly review, and emergency recommendations available.' },
  ]);
  const [typing, setTyping] = useState(false);
  const send = () => {
    if (!query.trim()) return;
    const q = query; setQuery('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => { setMessages((m) => [...m, { role: 'ai', content: `Threat assessment for "${q}": Elevated risk near ICU B. Recommend lockdown protocol and review CAM-12 feed. 2 unauthorized attempts in last hour.` }]); setTyping(false); }, 1100);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn(glassPanel, 'fixed bottom-24 right-6 z-[100] w-[min(100vw-2rem,420px)] max-h-[min(70vh,540px)] flex flex-col border-[#00C2E0]/35 shadow-[0_0_50px_rgba(30,111,255,0.2)] font-mono')}>
            <header className="flex justify-between p-4 border-b border-white/10"><div className="flex items-center gap-2"><Eye className="text-[#00E5FF]" size={20} /><div><p className="text-sm font-bold text-white">Surveillance AI</p><p className="text-[9px] text-[#00E5FF]">TACTICAL v4</p></div></div><button type="button" onClick={() => setOpen(false)}><X size={18} className="text-[#7F95B2]" /></button></header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar min-h-[180px]">
              {messages.map((m, i) => <div key={i} className={cn('p-3 rounded-xl text-xs leading-relaxed', m.role === 'ai' ? 'bg-[#1E6FFF]/15 border border-[#00C2E0]/25 text-white/90' : 'ml-auto bg-[#050D14] border border-white/10')}>{m.content}</div>)}
              {typing && <div className="flex gap-1">{[0,1,2].map((i) => <motion.span key={i} animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-2 h-2 rounded-full bg-[#00E5FF]" />)}</div>}
            </div>
            <footer className="p-4 border-t border-white/10 flex gap-2">
              <button type="button" className="p-2.5 rounded-xl border border-white/10 text-[#00E5FF]"><Mic size={18} /></button>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Threat query…" className="flex-1 bg-[#050D14]/90 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00C2E0]/40 focus:outline-none" />
              <button type="button" onClick={send} className="p-2.5 rounded-xl bg-gradient-to-r from-[#00C2E0] to-[#00E5FF] text-[#050D14]"><SendHorizontal size={18} /></button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button type="button" onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-gradient-to-br from-[#00C2E0] to-[#1E6FFF] shadow-[0_0_35px_rgba(0,229,255,0.5)] flex items-center justify-center border-2 border-[#00E5FF]/60">
        <motion.div animate={{ scale: [1,1.15,1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-[#00E5FF]/25" />
        <Sparkles className="text-[#050D14] relative z-10" size={24} />
      </motion.button>
    </>
  );
};
