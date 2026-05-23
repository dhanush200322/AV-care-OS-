import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mic, SendHorizontal, Headphones } from 'lucide-react';
import { cn } from '../../lib/utils';
import { glassPanel } from './theme';

export const ReceptionAIAssistant: React.FC<{ forceOpen?: boolean; onForceOpenChange?: (o: boolean) => void }> = ({ forceOpen, onForceOpenChange }) => {
  const [internal, setInternal] = useState(false);
  const open = forceOpen ?? internal;
  const setOpen = (v: boolean) => { setInternal(v); onForceOpenChange?.(v); };
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([
    { role: 'ai', content: 'Front Desk AI ready. I can help with registration, scheduling, queue tokens, and billing queries.' },
  ]);
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!query.trim()) return;
    const q = query;
    setQuery('');
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', content: `For "${q}": Check queue priority, verify patient ABHA, and suggest next available slot with Dr. Satish K. at 11:30.` }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn(glassPanel, 'fixed bottom-24 right-6 z-[100] w-[min(100vw-2rem,400px)] max-h-[min(70vh,520px)] flex flex-col border-[#00C2A8]/30')}>
            <header className="flex justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2"><Headphones className="text-[#00FFD5]" size={20} /><div><p className="text-sm font-bold text-white">Desk AI</p><p className="text-[9px] text-[#00FFD5] uppercase">Ops Assist</p></div></div>
              <button type="button" onClick={() => setOpen(false)}><X size={18} className="text-[#89A9B0]" /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar min-h-[180px]">
              {messages.map((m, i) => (
                <div key={i} className={cn('p-3 rounded-2xl text-sm max-w-[90%]', m.role === 'ai' ? 'bg-[#00C2A8]/10 border border-[#00C2A8]/20 text-white/90' : 'ml-auto bg-[#071A1D] border border-white/10')}>{m.content}</div>
              ))}
              {typing && <div className="flex gap-1">{[0,1,2].map((i) => <motion.span key={i} animate={{ opacity: [0.3,1,0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} className="w-2 h-2 rounded-full bg-[#00FFD5]" />)}</div>}
            </div>
            <footer className="p-4 border-t border-white/10 flex gap-2">
              <button type="button" className="p-2.5 rounded-xl border border-white/10 text-[#00FFD5]"><Mic size={18} /></button>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask desk AI…" className="flex-1 bg-[#071A1D]/80 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00C2A8]/40" />
              <button type="button" onClick={send} className="p-2.5 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#00FFD5] text-[#071A1D]"><SendHorizontal size={18} /></button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button type="button" onClick={() => setOpen(!open)} whileHover={{ scale: 1.05 }} className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full bg-gradient-to-br from-[#00C2A8] to-[#00FFD5] shadow-[0_0_30px_rgba(0,255,213,0.45)] flex items-center justify-center border-2 border-[#4CFFE1]/50">
        <motion.div animate={{ scale: [1,1.12,1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full bg-[#00FFD5]/20" />
        <Sparkles className="text-[#071A1D] relative z-10" size={24} />
      </motion.button>
    </>
  );
};
